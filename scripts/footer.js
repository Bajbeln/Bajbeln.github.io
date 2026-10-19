// Footer year updater (static footer is pre-rendered at build time)
document.addEventListener('DOMContentLoaded', function () {
  const yearSpan = document.getElementById('footer-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
