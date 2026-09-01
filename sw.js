// Noble Print India — Order Tracker service worker
// Kept intentionally minimal: this app's data always comes live from the
// Google Sheet, so we don't cache app data here. This file exists to:
//  1) satisfy Android/Chrome's installability checks so "Add to Home Screen"
//     launches full-screen instead of falling back to a plain browser tab, and
//  2) provide the ServiceWorkerRegistration.showNotification() API that iOS
//     Safari (16.4+) requires for any notification from a home-screen web app.

self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Required by some browsers' installability heuristics even as a no-op.
self.addEventListener('fetch', function (event) {
  // Pass everything straight through to the network.
});

// Focus (or open) the app when a rush-alert notification is tapped.
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (windowClients) {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./index.html');
    })
  );
});
