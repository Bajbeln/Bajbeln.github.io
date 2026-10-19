/**
 * Lazy loading polyfill for browsers that don't support native lazy loading
 * Uses Intersection Observer API with fallback
 */

(function() {
  'use strict';

  // Check if native lazy loading is supported
  if ('loading' in HTMLImageElement.prototype) {
    return; // Native lazy loading is supported
  }

  // Check if IntersectionObserver is available
  if (!('IntersectionObserver' in window)) {
    return; // No IntersectionObserver support, graceful degradation
  }

  // Load images that have loading="lazy" attribute
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if (lazyImages.length === 0) {
    return;
  }

  const imageObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const img = entry.target;
        // Replace data-src with src if it exists, otherwise just let the image load
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        // Remove the loading attribute to prevent re-processing
        img.removeAttribute('loading');
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach(function(img) {
    imageObserver.observe(img);
  });
})();
