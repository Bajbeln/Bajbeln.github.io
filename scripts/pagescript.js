// Any code on this file will be executed on every page load

document.addEventListener("DOMContentLoaded", () => {

    // Inject header container and fetch spex header partial
    document.body.insertAdjacentHTML('afterbegin', '<div id="spex-header-container"></div>');
    fetch('/partials/spex_page_header.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('spex-header-container').innerHTML = data;
      })
      .catch(error => console.error('Error loading spex header:', error));

    // Inject settings container after header
    var settingsHTML = '<div class="settings-container">' +
      '<button id="settings-button" onclick="openSettings()" aria-label="Öppna inställningar"><i class="fa fa-cog"></i></button>' +
      '<div id="settings-options" class="hide">' +
        '<button id="reading-mode-button" onclick="toggleReadingMode()" aria-label="Växla läsläge"><i class="fa fa-adjust"></i></button>' +
      '</div>' +
    '</div>';
    document.getElementById('spex-header-container').insertAdjacentHTML('afterend', settingsHTML);

    // Inject random button after the "Kopiera länk" button
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

async function getSongIndex(){
  const response = await fetch('/songIndex.json');
  if (!response.ok) {
    throw new Error('Failed to load song index');
  }
  return response.json();
}

function copyLink() {
  const link = window.location.href;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link)
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
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    showCopyFeedback();
  } catch (err) {
    alert("Failed to copy");
  }
  document.body.removeChild(textarea);
}

function showCopyFeedback() {
  const copyButton = document.querySelector('.copyButton');
  if (!copyButton) return;
  
  const originalText = copyButton.textContent;
  copyButton.textContent = 'Länk kopierad!';
  
  setTimeout(() => {
    copyButton.textContent = originalText;
    copyButton.style.backgroundColor = '';
  }, 2000);
}