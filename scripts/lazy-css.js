/**
 * Lazy load non-critical CSS
 * Loads CSS files asynchronously when needed
 */

// Font Awesome is used for icons - load it when DOM is ready
function loadFontAwesome() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
  link.media = 'print';
  link.onload = function() {
    this.media = 'all';
  };
  document.head.appendChild(link);
}

// Load Font Awesome asynchronously
document.addEventListener('DOMContentLoaded', loadFontAwesome);

// Also load it immediately if script is executed after DOM is ready
if (document.readyState !== 'loading') {
  loadFontAwesome();
}
