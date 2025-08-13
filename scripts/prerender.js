import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes to prerender
const staticRoutes = [
  '/',
  '/blog',
  '/explore',
  '/support'
];

// Function to get dynamic routes for prerendering
function getDynamicStaticRoutes() {
  const routes = [];
  
  // Get blog posts
  const blogDir = path.join(__dirname, '../src/data/blog');
  const languages = ['en', 'es'];
  
  for (const lang of languages) {
    const langDir = path.join(blogDir, lang);
    if (fs.existsSync(langDir)) {
      const files = fs.readdirSync(langDir);
      for (const file of files) {
        if (file.endsWith('.md')) {
          const slug = file.replace('.md', '');
          routes.push(`/blog/${slug}`);
        }
      }
    }
  }
  
  // Get legal pages
  const legalDir = path.join(__dirname, '../src/data/legal');
  for (const lang of languages) {
    const langDir = path.join(legalDir, lang);
    if (fs.existsSync(langDir)) {
      const files = fs.readdirSync(langDir);
      for (const file of files) {
        if (file.endsWith('.md')) {
          const slug = file.replace('.md', '');
          routes.push(`/legal/${slug}`);
        }
      }
    }
  }
  
  return routes;
}

// Create prerender configuration
function createPrerenderConfig() {
  const allRoutes = [
    ...staticRoutes,
    ...getDynamicStaticRoutes()
  ];
  
  const config = {
    staticRoutes: allRoutes,
    skipThirdPartyRequests: true,
    crawl: false,
    puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
    minifyOptions: {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true
    }
  };
  
  console.log(`📝 Prerender config created for ${allRoutes.length} routes`);
  return config;
}

// Export for use by react-snap
export default createPrerenderConfig();

// If run directly, log the configuration
if (process.argv[1] === __filename) {
  console.log('🚀 Prerender routes:');
  createPrerenderConfig().staticRoutes.forEach(route => {
    console.log(`  - ${route}`);
  });
}