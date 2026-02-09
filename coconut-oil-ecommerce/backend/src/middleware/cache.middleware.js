/**
 * Caching middleware for improved performance
 */

const cacheMiddleware = (duration = 3600) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Don't cache admin routes or authenticated routes
    if (req.path.includes('/admin') || 
        req.path.includes('/api/admin') ||
        req.headers.authorization) {
      return next();
    }

    // Set cache headers
    res.set('Cache-Control', `public, max-age=${duration}, stale-while-revalidate=600`);
    res.set('Vary', 'Accept-Encoding');
    
    // For static assets, cache longer
    if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
      res.set('Cache-Control', `public, max-age=31536000, immutable`);
    }

    next();
  };
};

module.exports = cacheMiddleware;
