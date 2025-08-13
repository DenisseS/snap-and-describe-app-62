#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting static site generation...');

async function buildStatic() {
  try {
    // Get site URL from environment or default
    const SITE_URL = process.env.VITE_SITE_URL || 'https://yourapp.com';
    console.log(`📍 Using site URL: ${SITE_URL}`);

    // Step 1: Generate sitemap and robots.txt with environment URL
    console.log('🗺️ Generating sitemap...');
    await execAsync('node scripts/generateSitemap.js');
    
    // Step 1.5: Replace URL placeholders in static files
    console.log('🔄 Replacing URL placeholders...');
    const filesToUpdate = [
      path.join(__dirname, '../public/sitemap.xml'),
      path.join(__dirname, '../public/robots.txt')
    ];

    for (const filePath of filesToUpdate) {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/__SITE_URL__/g, SITE_URL);
        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated ${path.basename(filePath)} with site URL`);
      }
    }

    // Step 2: Regular Vite build
    console.log('📦 Building with Vite...');
    await execAsync('npm run build');
    
    // Step 3: Copy important files to dist
    console.log('📋 Copying static assets...');
    const distDir = path.join(__dirname, '../dist');
    
    // Ensure robots.txt and sitemap.xml are in dist
    const publicDir = path.join(__dirname, '../public');
    const filesToCopy = ['robots.txt', 'sitemap.xml', 'manifest.json'];
    
    for (const file of filesToCopy) {
      const srcPath = path.join(publicDir, file);
      const destPath = path.join(distDir, file);
      
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ Copied ${file}`);
      }
    }
    
    // Step 4: Create _redirects file for SPA fallback (for Netlify compatibility)
    const redirectsContent = `# Static routes - serve as-is
/blog/*    /blog/:splat    200
/legal/*   /legal/:splat   200
/product/* /product/:splat 200

# Dynamic routes - fallback to SPA
/favorites     /index.html    200
/shopping-lists    /index.html    200
/shopping-lists/*  /index.html    200
/camera        /index.html    200
/recipes       /index.html    200
/auth/*        /index.html    200

# Fallback
/*             /index.html    200
`;
    
    fs.writeFileSync(path.join(distDir, '_redirects'), redirectsContent);
    console.log('✅ Created _redirects file');
    
    // Step 5: Create .htaccess for Apache servers
    const htaccessContent = `RewriteEngine On

# Handle Angular and Vue.js HTML5 mode
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^blog/ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^legal/ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^product/ - [L]

# Fallback to index.html for SPA routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<filesMatch "\\.(ico|css|js|gif|jpeg|jpg|png|svg|woff|ttf|eot)$">
  Header set Cache-Control "max-age=31536000, public, immutable"
</filesMatch>
`;
    
    fs.writeFileSync(path.join(distDir, '.htaccess'), htaccessContent);
    console.log('✅ Created .htaccess file');
    
    console.log('🎉 Static site generation completed successfully!');
    
    // Report build stats
    const stats = fs.statSync(distDir);
    console.log(`📊 Build directory: ${distDir}`);
    console.log(`📊 Total files in dist: ${fs.readdirSync(distDir).length}`);
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildStatic();