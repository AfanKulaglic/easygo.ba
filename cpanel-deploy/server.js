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

// Load the config from the build output
const requiredServerFiles = require(path.join(
  __dirname,
  ".next",
  "required-server-files.json"
));
const nextConfig = requiredServerFiles.config;

// Fix paths - the build was done on Windows, override to current dir
nextConfig.outputFileTracingRoot = __dirname;
if (nextConfig.turbopack) {
  nextConfig.turbopack.root = __dirname;
}

// This is critical - the standalone build expects this env var
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
