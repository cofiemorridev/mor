import React from 'react';
import { useLazyImage, getOptimizedImageUrl } from '../../utils/imageOptimization';

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect width="800" height="600" fill="%23f5f5dc"/%3E%3Cpath d="M400,300 Q500,200 600,300 T800,300 L800,600 L0,600 L0,300 Q200,400 400,300Z" fill="%234a7c2c" opacity="0.2"/%3E%3C/svg%3E',
  ...props
}) => {
  const optimizedSrc = getOptimizedImageUrl(src, { width, height });
  const { loaded, error, src: imageSrc } = useLazyImage(optimizedSrc, placeholder);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        sizes={sizes}
        className={`transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${error ? 'border-2 border-red-200' : ''}`}
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : 'auto',
          objectFit: 'cover'
        }}
        onError={(e) => {
          e.target.src = '/images/oil-bottle.png';
        }}
        {...props}
      />
      
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-amber-50 animate-pulse flex items-center justify-center">
          <div className="text-green-800 opacity-50">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-red-50 flex items-center justify-center">
          <div className="text-red-400 text-center">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm mt-2">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
