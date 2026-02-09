const express = require('express');
const router = express.Router();
const SitemapGenerator = require('../utils/sitemapGenerator');

// Generate sitemap.xml
router.get('/sitemap.xml', (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
  
  try {
    const sitemap = SitemapGenerator.generateSitemap({
      baseUrl,
      lastmod: new Date().toISOString().split('T')[0]
    });
    
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating sitemap'
    });
  }
});

// Generate robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
  
  try {
    const robotsTxt = SitemapGenerator.generateRobotsTxt({
      baseUrl,
      allowAdmin: process.env.NODE_ENV === 'development'
    });
    
    res.header('Content-Type', 'text/plain');
    res.send(robotsTxt);
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating robots.txt'
    });
  }
});

// Generate product sitemap
router.get('/products.xml', (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
  
  // Mock product data - in production, fetch from database
  const products = [
    { id: 1, name: 'Pure Coconut Oil', shortDescription: 'Pure coconut oil for cooking and beauty', images: ['/images/oil-bottle.png'] },
    { id: 2, name: 'Virgin Coconut Oil', shortDescription: 'High-quality virgin coconut oil', images: ['/images/oil-bottle.png'] }
  ];
  
  try {
    const sitemap = SitemapGenerator.generateProductSitemap(products, baseUrl);
    
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating product sitemap:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating product sitemap'
    });
  }
});

module.exports = router;
