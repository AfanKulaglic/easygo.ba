# How to Create a cPanel-Ready ZIP for EasyGo Next.js App

This guide documents the **exact** steps for packaging the Next.js app for cPanel deployment.
Send this file to Copilot and say: "Follow this guide to build and create a cPanel zip for me."

---

## 1. Project Info

- **Framework:** Next.js 16 (App Router, Turbopack, `output: 'standalone'` in next.config.js)
- **Project root:** The folder containing `package.json`, `src/`, `public/`, `next.config.js`
- **cPanel deployment path:** `public_html/easygo`
- **cPanel startup file:** `server.js` (NOT app.js)
- **Hosting:** Phusion Passenger on cPanel (Node.js app)

---

## 2. What Goes in the ZIP (top-level, flat — no wrapper folder)

| Item | Source | Notes |
|------|--------|-------|
| `.next/` | `.next/standalone/.next/` + `.next/static/` merged in | Standalone build output + static assets |
| `node_modules/` | `.next/standalone/node_modules/` | Minimal standalone node_modules (NOT the full project node_modules) |
| `public/` | Project root `public/` | Static files (images, manifest, robots, sitemap) |
| `server.js` | `cpanel-deploy/server.js` | Phusion Passenger-compatible entry — **NEVER modify this file** |
| `package.json` | `cpanel-deploy/server.js` directory or project root | Standard package.json |
| `.htaccess` | See content below | Force HTTPS via Passenger |
| `tmp/restart.txt` | Empty file | Required by Passenger for restart signaling |

---

## 3. Critical Files (DO NOT CHANGE)

### server.js — Phusion Passenger entry point
```js
// cPanel Phusion Passenger integration
if (typeof PhusionPassenger !== "undefined") {
  PhusionPassenger.configure({ autoInstall: false });
}

const path = require("path");
const { createServer } = require("http");
const { parse } = require("url");

const dir = path.join(__dirname);
process.env.NODE_ENV = "production";
process.chdir(__dirname);

const requiredServerFiles = require(path.join(
  __dirname, ".next", "required-server-files.json"
));
const nextConfig = requiredServerFiles.config;

nextConfig.outputFileTracingRoot = __dirname;
if (nextConfig.turbopack) {
  nextConfig.turbopack.root = __dirname;
}

process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(nextConfig);

const next = require("next");

const app = next({
  dev: false,
  dir: dir,
  hostname: "0.0.0.0",
  port: 0,
  conf: nextConfig,
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  if (typeof PhusionPassenger !== "undefined") {
    server.listen("passenger", () => {
      console.log("Next.js running via Phusion Passenger");
    });
  } else {
    const port = process.env.PORT || 3000;
    server.listen(port, "0.0.0.0", () => {
      console.log("> Ready on http://0.0.0.0:" + port);
    });
  }
});
```

### .htaccess
```
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 4. Build & Package Steps (Windows PowerShell)

### Step 1: Clean install (if node_modules may be corrupted)
```powershell
cd "PROJECT_ROOT"
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue
npm install
```

### Step 2: Build
```powershell
npm run build
```
Verify it says "Compiled successfully" and shows routes.

### Step 3: Assemble deployment folder
```powershell
$base = "PROJECT_ROOT"
$out = "OUTPUT_FOLDER"              # e.g. c:\Users\...\easygo-cpanel-new
$standalone = "$base\.next\standalone"

# Start fresh
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item $out -ItemType Directory -Force | Out-Null

# Copy .next from standalone build
Copy-Item "$standalone\.next" "$out\.next" -Recurse -Force

# Merge static assets into .next/static
Copy-Item "$base\.next\static" "$out\.next\static" -Recurse -Force

# Copy standalone node_modules (NOT the full project node_modules!)
Copy-Item "$standalone\node_modules" "$out\node_modules" -Recurse -Force

# Copy public folder from project root
Copy-Item "$base\public" "$out\public" -Recurse -Force

# Copy server.js from cpanel-deploy (the KNOWN WORKING version)
Copy-Item "$base\cpanel-deploy\server.js" "$out\server.js" -Force

# Copy .htaccess
Copy-Item "$base\cpanel-deploy\.htaccess" "$out\.htaccess" -Force
# (or create it manually with the content above)

# Copy package.json
Copy-Item "$base\package.json" "$out\package.json" -Force

# Create tmp/restart.txt
New-Item "$out\tmp" -ItemType Directory -Force | Out-Null
New-Item "$out\tmp\restart.txt" -ItemType File -Force | Out-Null
```

### Step 4: Create ZIP using `tar` (CRITICAL — NOT Compress-Archive!)
```powershell
$zipPath = "c:\Users\...\easygo-cpanel.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Push-Location $out
tar -a -cf $zipPath *
Pop-Location
```

**WARNING:** Do NOT use PowerShell's `Compress-Archive`. It creates zips with Windows backslash paths (`\`) that Linux/cPanel cannot extract correctly. Always use `tar -a -cf` which produces forward-slash paths (`/`).

---

## 5. Deploy on cPanel

1. Upload `easygo-cpanel.zip` to `public_html/easygo/` via File Manager
2. Extract so all files are **directly** in `public_html/easygo/` (not in a subfolder)
3. In cPanel > Setup Node.js App:
   - Application root: `public_html/easygo`
   - Startup file: `server.js`
   - Node.js version: 18+
4. Click "Restart" (or touch `tmp/restart.txt`)

---

## 6. Known Pitfalls (DO NOT DO THESE)

| Mistake | What happens |
|---------|-------------|
| Using `Compress-Archive` to create zip | Backslash paths — Linux can't extract properly |
| Modifying `server.js` (e.g. replacing `url.parse`) | Breaks Next.js `handle()` compatibility |
| Using project root `node_modules/` instead of standalone | Massive zip, missing trace files, may crash |
| Editing files in `node_modules/` | Corruption persists through builds — must `rm + npm install` |
| Copying `.next` from project root instead of standalone | Wrong build output, missing bundled deps |

### 6.1 The `url.parse` vs `new URL` trap (April 2026 incident)

**Symptom:** App deploys cleanly to cPanel, Passenger boots without errors, but pages return 500 / routing fails / `handle()` throws once a real request comes in.

**Root cause:** Someone (an AI agent, a linter, a deprecation-warning fix) "modernized" `server.js` by replacing the legacy `url.parse()` call with the WHATWG `new URL()`:

```js
// ❌ BROKEN — looks "modern" but breaks Next.js routing on Passenger
const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
await handle(req, res, parsedUrl);
```

Next.js's `handle()` expects the **legacy `url.parse(req.url, true)` shape** (with `.query` as a parsed object, `.pathname`, etc.). A WHATWG `URL` instance has different property semantics (`searchParams` instead of `query`) and Next silently fails to route.

**Correct version (always keep this):**

```js
const { parse } = require("url");
// ...
const parsedUrl = parse(req.url, true);
await handle(req, res, parsedUrl);
```

**Yes, Node prints `DEP0169` warning about `url.parse()` at build time. Ignore it.** That deprecation warning is a Node-level signal; Next.js's standalone runtime still requires the legacy shape. Do NOT "fix" the warning by switching to `new URL()`.

**Recovery procedure if it happens again:**
1. Extract the last working zip (e.g. `easygo-cpanel-deploy-WORK.zip`) somewhere.
2. Diff its `server.js` against `cpanel-deploy/server.js`.
3. Restore the working `server.js` to `cpanel-deploy/server.js`.
4. Rebuild + repackage per Section 4.

**Guardrail:** Before zipping, run this check — if it prints anything, STOP and restore the legacy version:
```powershell
Select-String -Path "$out\server.js" -Pattern "new URL\("
```

---

## 7. Verification Checklist

After assembling, the output folder should contain exactly:
```
.htaccess          (4 lines, HTTPS redirect)
.next/             (from standalone, with static/ merged in)
node_modules/      (from standalone — ~14 top-level packages)
package.json
public/            (assets/, manifest.json, robots.txt, sitemap.xml, etc.)
server.js          (Passenger-compatible, ~67 lines)
tmp/restart.txt    (empty file)
```

Verify inside the zip paths use forward slashes:
```
.next/server/...
.next/static/...
public/assets/...
```
NOT backslashes like `.next\server\...`
