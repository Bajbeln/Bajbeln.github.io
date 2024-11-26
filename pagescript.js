// Any code on this file will be executed on every page load exept main page

document.addEventListener("DOMContentLoaded", () => {

    // Check if reading mode is enabled
    if(document.cookie.includes("readingMode=true")){
      let content = Array.from(document.getElementsByClassName("content"))
      content.forEach(content => content.classList.add("reading-mode")) // Add reading mode class to content

      let buttons = Array.from(document.getElementsByClassName("collapsible"))
      buttons.forEach(button => button.classList.add("reading-mode")) // Add reading mode class to buttons
    }
  });