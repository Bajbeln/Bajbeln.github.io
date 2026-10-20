// Common scripts executed on page load

// Header is statically pre-rendered, so layout is immediately ready
window.headerReadyPromise = Promise.resolve();

document.addEventListener('DOMContentLoaded', function () {
  // Apply reading mode if saved in preferences
  if (typeof getSetting === 'function') {
    if (getSetting('readingMode')) {
      addReadingMode();
    }
    if (getSetting('darkMode')) {
      addDarkMode();
    }
  }
});

// Register service worker for offline support and faster loads (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function (err) {
      console.warn('ServiceWorker registration failed: ', err);
    });
  });
}

function copyLink() {
  const link = window.location.origin + window.location.pathname + window.location.hash;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        showCopyFeedback();
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        fallbackCopy(link);
      });
  } else {
    fallbackCopy(link);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showCopyFeedback();
  } catch (err) {
    alert('Failed to copy');
  }
  document.body.removeChild(textarea);
}

function showCopyFeedback() {
  const copyButton = document.querySelector('.copyButton:not(.copy-main)');
  if (!copyButton) return;

  const originalText = copyButton.textContent;
  copyButton.style.width = copyButton.offsetWidth + 'px';
  copyButton.textContent = 'Kopierad!';

  setTimeout(() => {
    copyButton.textContent = originalText;
    copyButton.style.width = '';
    copyButton.style.backgroundColor = '';
  }, 2000);
}
