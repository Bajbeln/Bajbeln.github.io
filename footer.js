// Load footer from external file
function loadFooter() {
  fetch('/footer.html')
    .then(response => response.text())
    .then(data => {
      const footerContainer = document.getElementById('footer-container');
      if (footerContainer) {
        footerContainer.innerHTML = data;
        var yearSpan = document.getElementById('footer-year');
        if (yearSpan) {
          yearSpan.textContent = new Date().getFullYear();
        }
      }
    })
    .catch(error => console.error('Error loading footer:', error));
}

// Load footer when DOM is ready
document.addEventListener('DOMContentLoaded', loadFooter);