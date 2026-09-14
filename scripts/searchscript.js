
document.addEventListener('DOMContentLoaded', function() {
    // Function to get the query parameter from the URL
    function getSearchParam() {
        const params = new URLSearchParams(window.location.search);
        return params.get('search');
    }

    const searchTerm = getSearchParam();

    if (searchTerm) {
        const headerReady = window.headerReadyPromise || Promise.resolve();
        headerReady.then(runSearch);
    }

    function runSearch() {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const songButtons = document.getElementsByClassName('collapsible');
        let found = false;

        // Loop through each song title (button) to find a match
        for (let i = 0; i < songButtons.length; i++) {
            const songTitle = songButtons[i].textContent.toLowerCase();

            if (songTitle.includes(lowerSearchTerm)) {
                songButtons[i].style.backgroundColor = '#ffd54f';
                setTimeout(() => {
                    songButtons[i].style.backgroundColor = '';
                }, 2000);

                // Expand the song first, then scroll once the expand
                // animation has finished so the scroll target accounts
                // for the fully-visible lyrics (maximizes what's shown).
                const block = songButtons[i].closest('.song-block');
                const contentDiv = block ? block.querySelector('.content') : songButtons[i].nextElementSibling;
                songButtons[i].click();

                let scrolled = false;
                const scrollToSong = () => {
                    if (scrolled) return;
                    scrolled = true;
                    songButtons[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
                };

                if (contentDiv) {
                    contentDiv.addEventListener('transitionend', scrollToSong, { once: true });
                }
                setTimeout(scrollToSong, 350); // fallback if transitionend doesn't fire

                found = true;
                break;
            }
        }

        if (!found) {
            alert("No matching song found on this page. " + searchTerm);

        }
    }
});
