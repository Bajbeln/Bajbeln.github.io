// Caching module for songIndex.json to avoid repeated fetches
(function () {
  let cachedData = null;
  let fetchPromise = null;

  window.getSongIndex = function () {
    // If we have in-memory cached data, return it immediately
    if (cachedData) {
      return Promise.resolve(cachedData);
    }

    // Try reading from sessionStorage to persist across page navigations in the same session
    try {
      const stored = sessionStorage.getItem('bajbeln_song_index');
      if (stored) {
        cachedData = JSON.parse(stored);
        return Promise.resolve(cachedData);
      }
    } catch (e) {}

    // If a fetch is already in progress, return that promise
    if (fetchPromise) {
      return fetchPromise;
    }

    // Start a new fetch
    fetchPromise = fetch('/songIndex.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        cachedData = data;
        fetchPromise = null;
        try {
          sessionStorage.setItem('bajbeln_song_index', JSON.stringify(data));
        } catch (e) {}
        return data;
      })
      .catch((error) => {
        fetchPromise = null;
        throw error;
      });

    return fetchPromise;
  };
})();
