// Any code on this file will be executed on every page load exept main page

document.addEventListener("DOMContentLoaded", () => {

    // Inject settings container
    var settingsHTML = '<div class="settings-container">' +
      '<button id="settings-button" onclick="openSettings()"><i class="fa fa-cog"></i></button>' +
      '<div id="settings-options" class="hide">' +
        '<button id="reading-mode-button" onclick="toggleReadingMode()"><i class="fa fa-adjust"></i></button>' +
      '</div>' +
    '</div>';
    document.body.insertAdjacentHTML('afterbegin', settingsHTML);

    // Load Font Awesome if not already loaded
    if (!document.querySelector('link[href*="font-awesome"]')) {
      var fa = document.createElement('link');
      fa.rel = 'stylesheet';
      fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
      document.head.appendChild(fa);
    }

    // Check if reading mode is enabled
    if(document.cookie.includes("readingMode=true")){
      addReadingMode();
    }
  });

function copyLink() {
  navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
    if (result.state === "granted" || result.state === "prompt") {
      let link = window.location.href
      navigator.clipboard.writeText(link)
    }
    else{
      alert("Clipboard permission denied")
    }
  });
    
}