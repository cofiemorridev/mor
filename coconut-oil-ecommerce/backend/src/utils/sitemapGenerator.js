/**
 * Sitemap generator for SEO optimization
 */

const SitemapGenerator = {
  /**
   * Generate sitemap XML
   * @param {Object} options - Generation options
   * @returns {string} Sitemap XML
   */
  generateSitemap: (options = {}) => {
    const {
      baseUrl = 'https://coconutoilghana.com',
      lastmod = new Date().toISOString().split('T')[0],
      changefreq = 'weekly',
      priority = 0.8
    } = options;

    const pages = [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/products', priority: 0.9, changefreq: 'daily' },
      { url: '/about', priority: 0.7, changefreq: 'monthly' },
      { url: '/contact', priority: 0.7, changefreq: 'monthly' },
      { url: '/admin/login', priority: 0.3, changefreq: 'monthly' }
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    pages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq || changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority || priority}</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    return xml;
  },

  /**
   * Generate robots.txt content
   * @param {Object} options - Generation options
   * @returns {string} robots.txt content
   */
  generateRobotsTxt: (options = {}) => {
    const {
      baseUrl = 'https://coconutoilghana.com',
      allowAdmin = false
    } = options;

    let robots = `# Robots.txt for Coconut Oil Ghana
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /cart/
Disallow: /checkout/
Disallow: /payment/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (seconds)
Crawl-delay: 2

# Host
Host: ${baseUrl}

# Allow indexing of product images
Allow: /images/
Allow: /uploads/

# Disallow dynamic parameters
Disallow: /*?*
Disallow: /*&*

# Allow essential parameters
Allow: /products?category=
Allow: /products?search=`;

    if (!allowAdmin) {
      robots += '\n\n# Admin panel (block all crawlers)';
      robots += '\nUser-agent: *';
      robots += '\nDisallow: /admin/';
    }

    return robots;
  },

  /**
   * Generate product sitemap entries
   * @param {Array} products - Product data
   * @param {string} baseUrl - Base URL
   * @returns {string} Product sitemap XML
   */
  generateProductSitemap: (products, baseUrl = 'https://coconutoilghana.com') => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    products.forEach(product => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/products/${product.id}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      
      // Add image sitemap data if available
      if (product.images && product.images.length > 0) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${baseUrl}${product.images[0]}</image:loc>\n`;
        xml += `      <image:caption>${product.name} - ${product.shortDescription}</image:caption>\n`;
        xml += `      <image:title>${product.name}</image:title>\n`;
        xml += `    </image:image>\n`;
      }
      
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    return xml;
  }
};

module.exports = SitemapGenerator;
