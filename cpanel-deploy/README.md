# cPanel Deployment - easygo.ba

## How to deploy on cPanel

### Step 1: Create Node.js App in cPanel
1. Log in to cPanel
2. Go to **Setup Node.js App**
3. Click **Create Application**
4. Set these values:
   - **Node.js version**: 18 or higher
   - **Application mode**: Production
   - **Application root**: `easygo.ba` (or wherever you upload the files)
   - **Application URL**: `/` (your domain root)
   - **Application startup file**: `app.js`
5. Click **Create**

### Step 2: Upload Files
1. Upload the contents of this ZIP to the **Application root** folder
   - Use cPanel File Manager or FTP
   - Upload everything inside the ZIP into the app root folder
   - The structure should be:
     ```
     /home/your-user/easygo.ba/
     ├── app.js
     ├── .htaccess
     ├── package.json
     ├── .next/
     ├── node_modules/
     ├── public/
     └── tmp/
     ```

### Step 3: Restart the App
1. Go back to **Setup Node.js App** in cPanel
2. Click the **Restart** button for your application
3. Or create/touch the file `tmp/restart.txt`:
   ```
   mkdir -p tmp && touch tmp/restart.txt
   ```

### Important Notes
- **No `npm install` needed** - `node_modules` is already included
- All subpages (products, cart, contact, etc.) will work with direct URLs
- The `app.js` file is compatible with Phusion Passenger (cPanel's app server)
- If you see a Passenger error, check the error logs in cPanel
