// Development version. Kept minimal to reduce cache problems during testing.
self.addEventListener('install', event => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(clients.claim()));
