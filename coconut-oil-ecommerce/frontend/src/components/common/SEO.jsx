import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO component for managing meta tags and structured data
 * Uses react-helmet-async for server-side rendering compatibility
 */

const SEO = ({
  title = 'Premium Coconut Oil | Pure & Natural from Ghana',
  description = 'Pure, natural coconut oil from Ghana. 100% organic cold-pressed coconut oil for cooking, beauty, and health.',
  keywords = 'coconut oil, Ghana, organic, natural, cold-pressed, virgin coconut oil, pure coconut oil',
  image = '/images/logo.png',
  url = '',
  type = 'website',
  siteName = 'Coconut Oil Ghana',
  twitterHandle = '@coconutoilgh',
  structuredData = null,
  canonicalUrl = '',
  noindex = false,
  nofollow = false
}) => {
  const fullUrl = canonicalUrl || `${window.location.origin}${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;

  // Generate robots meta content
  const robotsMeta = [];
  if (noindex) robotsMeta.push('noindex');
  if (nofollow) robotsMeta.push('nofollow');
  const robotsContent = robotsMeta.length > 0 ? robotsMeta.join(', ') : 'index, follow';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_GH" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Additional SEO Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#2d5016" />
      <meta name="author" content="Coconut Oil Ghana" />
      <meta name="copyright" content={`© ${new Date().getFullYear()} Coconut Oil Ghana`} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Default Structured Data for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Coconut Oil Ghana",
          "url": "https://coconutoilghana.com",
          "logo": `${window.location.origin}/images/logo.png`,
          "description": "Premium coconut oil from Ghana",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "GH"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["English"]
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
