const CLEAR_API_CACHE = () => {
  caches.keys().then((cacheNames) => {
    cacheNames.forEach((cacheName) => {
      caches.delete(cacheName);
    });
  });
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {

    for(let registration of registrations) {
      registration.unregister()
    }

    CLEAR_API_CACHE();
  }).catch(function(err) {
    console.log('Service Worker registration failed: ', err);
  });
}
