// Settings functions shared across all pages

function getSetting(key) {
  try {
    const val = localStorage.getItem(key);
    return val === 'true';
  } catch (e) {
    return false;
  }
}

function setSetting(key, bool) {
  try {
    localStorage.setItem(key, String(bool));
  } catch (e) {
    console.warn('Could not save setting:', key, e);
  }
}

function openSettings() {
  const optionsDiv = document.getElementById('settings-options');
  if (!optionsDiv) return;
  optionsDiv.classList.toggle('show');
  optionsDiv.classList.toggle('hide');
}

function toggleReadingMode() {
  if (getSetting('readingMode')) {
    setSetting('readingMode', false);
    removeReadingMode();
  } else {
    setSetting('readingMode', true);
    addReadingMode();
  }
}

function addReadingMode() {
  document.documentElement.classList.add('reading-mode-active');
  const content = Array.from(document.getElementsByClassName('content'));
  content.forEach((el) => el.classList.add('reading-mode'));

  const buttons = Array.from(document.getElementsByClassName('collapsible'));
  buttons.forEach((button) => button.classList.add('reading-mode'));

  const linkButtons = Array.from(document.getElementsByClassName('button'));
  linkButtons.forEach((button) => button.classList.add('reading-mode'));
}

function removeReadingMode() {
  document.documentElement.classList.remove('reading-mode-active');
  const content = Array.from(document.getElementsByClassName('content'));
  content.forEach((el) => el.classList.remove('reading-mode'));

  const buttons = Array.from(document.getElementsByClassName('collapsible'));
  buttons.forEach((button) => button.classList.remove('reading-mode'));

  const linkButtons = Array.from(document.getElementsByClassName('button'));
  linkButtons.forEach((button) => button.classList.remove('reading-mode'));
}

function toggleDarkMode() {
  if (getSetting('darkMode')) {
    setSetting('darkMode', false);
    removeDarkMode();
  } else {
    setSetting('darkMode', true);
    addDarkMode();
  }
}

function addDarkMode() {
  document.documentElement.classList.add('dark-mode');
  if (document.body) {
    document.body.classList.add('dark-mode');
  }
}

function removeDarkMode() {
  document.documentElement.classList.remove('dark-mode');
  if (document.body) {
    document.body.classList.remove('dark-mode');
  }
}
