// Caching module for songIndex.json to avoid repeated fetches
(function() {
    let cachedData = null;
    let fetchPromise = null;

    window.getSongIndex = function() {
        // If we have cached data, return it immediately
        if (cachedData) {
            return Promise.resolve(cachedData);
        }

        // If a fetch is already in progress, return that promise
        if (fetchPromise) {
            return fetchPromise;
        }

        // Start a new fetch
        fetchPromise = fetch('/songIndex.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                cachedData = data;
                fetchPromise = null;
                return data;
            })
            .catch(error => {
                fetchPromise = null;
                throw error;
            });

        return fetchPromise;
    };
})();
