// Any code on this file will be executed on every page load

document.addEventListener("DOMContentLoaded", () => {

    // Inject settings container
    var settingsHTML = '<div class="settings-container">' +
      '<button id="settings-button" onclick="openSettings()" aria-label="Öppna inställningar"><i class="fa fa-cog"></i></button>' +
      '<div id="settings-options" class="hide">' +
        '<button id="reading-mode-button" onclick="toggleReadingMode()" aria-label="Växla läsläge"><i class="fa fa-adjust"></i></button>' +
      '</div>' +
    '</div>';
    document.body.insertAdjacentHTML('afterbegin', settingsHTML);

    // Inject random button after the "Kopiera Länk" button
    var copyButton = document.querySelector('.copyButton');
    if (copyButton) {
      var randomBtn = document.createElement('button');
      randomBtn.className = 'random-page';
      randomBtn.setAttribute('aria-label', 'Gå till en slumpmässig sång');
      randomBtn.textContent = 'Räändom';
      randomBtn.addEventListener('click', function() {
        getSongIndex()
          .then(data => {
            const randomSong = data[Math.floor(Math.random() * data.length)];
            window.location.href = randomSong.page + '?search=' + encodeURIComponent(randomSong.title);
          })
          .catch(error => {
            console.error('Error fetching song index:', error);
            alert("Could not load the song index file.");
          });
      });
      copyButton.parentNode.insertBefore(randomBtn, copyButton.nextSibling);
    }

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

function getSongIndex() {
  return fetch('/songIndex.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load song index');
      }
      return response.json();
    });
}

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