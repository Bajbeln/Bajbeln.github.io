
document.addEventListener('DOMContentLoaded', function() {
    // Function to get the query parameter from the URL
    function getSearchParam() {
        const params = new URLSearchParams(window.location.search);
        return params.get('search');
    }

    const searchTerm = getSearchParam();

    if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const songButtons = document.getElementsByClassName('collapsible');
        let found = false;

        // Loop through each song title (button) to find a match
        for (let i = 0; i < songButtons.length; i++) {
            const songTitle = songButtons[i].textContent.toLowerCase();

            if (songTitle.includes(lowerSearchTerm)) {
                // Scroll to the matching song
                songButtons[i].scrollIntoView({ behavior: 'smooth', block: 'start' });

                
                songButtons[i].style.backgroundColor = '#ffd54f';
                setTimeout(() => {
                    songButtons[i].style.backgroundColor = '';
                }, 2000); 
                songButtons[i].click();

                found = true;
                break;
            }
        }

        if (!found) {
            alert("No matching song found on this page.");
        }
    }
});
