import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL for the site - use environment variable or fallback
const BASE_URL = process.env.VITE_SITE_URL || 'https://yourapp.com';

// Static routes
const staticRoutes = [
  '/',
  '/blog',
  '/explore',
  '/support'
];

// Function to get all blog posts
function getBlogPosts() {
  const blogDir = path.join(__dirname, '../src/data/blog');
  const languages = ['en', 'es'];
  const posts = [];
  
  for (const lang of languages) {
    const langDir = path.join(blogDir, lang);
    if (fs.existsSync(langDir)) {
      const files = fs.readdirSync(langDir);
      for (const file of files) {
        if (file.endsWith('.md')) {
          const slug = file.replace('.md', '');
          posts.push(`/blog/${slug}`);
        }
      }
    }
  }
  
  return posts;
}

// Function to get all legal pages
function getLegalPages() {
  const legalDir = path.join(__dirname, '../src/data/legal');
  const languages = ['en', 'es'];
  const pages = [];
  
  for (const lang of languages) {
    const langDir = path.join(legalDir, lang);
    if (fs.existsSync(langDir)) {
      const files = fs.readdirSync(langDir);
      for (const file of files) {
        if (file.endsWith('.md')) {
          const slug = file.replace('.md', '');
          pages.push(`/legal/${slug}`);
        }
      }
    }
  }
  
  return pages;
}

// Function to get top products for static generation
function getTopProducts() {
  // For now, return a limited set - can be expanded based on analytics
  const topProducts = [
    'apple',
    'banana',
    'rice',
    'chicken-breast',
    'salmon',
    'broccoli',
    'spinach',
    'oats',
    'quinoa',
    'almonds'
  ];
  
  return topProducts.map(slug => `/product/${slug}`);
}

// Generate sitemap XML
function generateSitemap() {
  const allRoutes = [
    ...staticRoutes,
    ...getBlogPosts(),
    ...getLegalPages(),
    ...getTopProducts()
  ];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route === '/' ? 'daily' : route.startsWith('/blog') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : route.startsWith('/blog') ? '0.8' : '0.6'}</priority>
  </url>`).join('\n')}
</urlset>`;

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemap);
  console.log(`✅ Sitemap generated with ${allRoutes.length} URLs`);
}

// Generate robots.txt
function generateRobots() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

  const outputPath = path.join(__dirname, '../public/robots.txt');
  fs.writeFileSync(outputPath, robots);
  console.log('✅ Robots.txt generated');
}

// Main execution
generateSitemap();
generateRobots();