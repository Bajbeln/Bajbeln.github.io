// Settings functions shared across all pages

function openSettings() {
  let optionsDiv = document.getElementById("settings-options");
  optionsDiv.classList.toggle("show");
  optionsDiv.classList.toggle("hide");
}

function toggleReadingMode() {
  console.log(document.cookie);
  if (document.cookie.includes("readingMode=true")) {
    document.cookie = "readingMode=false";
    removeReadingMode();
  } else {
    document.cookie = "readingMode=true";
    addReadingMode();
  }
}

function addReadingMode() {
  let content = Array.from(document.getElementsByClassName("content"));
  content.forEach(el => el.classList.add("reading-mode"));

  let buttons = Array.from(document.getElementsByClassName("collapsible"));
  buttons.forEach(button => button.classList.add("reading-mode"));

  let linkButtons = Array.from(document.getElementsByClassName("button"));
  linkButtons.forEach(button => button.classList.add("reading-mode"));
}

function removeReadingMode() {
  let content = Array.from(document.getElementsByClassName("content"));
  content.forEach(el => el.classList.remove("reading-mode"));

  let buttons = Array.from(document.getElementsByClassName("collapsible"));
  buttons.forEach(button => button.classList.remove("reading-mode"));

  let linkButtons = Array.from(document.getElementsByClassName("button"));
  linkButtons.forEach(button => button.classList.remove("reading-mode"));
}
