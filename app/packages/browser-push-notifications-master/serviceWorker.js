
self.addEventListener('push', showNotification);

function showNotification(event) {
  console.log('Received a push message', event);

  event.waitUntil(
    event.target.registration.pushManager.getSubscription().then(function(subscription) {
      console.log(subscription);
      subscription.subscriptionId = subscription.endpoint.split('https://android.googleapis.com/gcm/send/')[1];
      var endpoint = event.target.registration.scope + 'bp_notifications/'
                   + encodeURIComponent(subscription.subscriptionId);

      // Since there is no payload data with the first version of push messages,
      // we'll grab some data from an API and use it to populate a notification
      fetch(endpoint, {credentials: 'include'}).then(function(response) {
        if (response.status !== 200) {
         console.log('Looks like there was a problem. Status Code: ' + response.status);
         throw new Error();
        }

        // Examine the text in the response
        return response.json().then(function(data) {
          if (data.error || !data.notifications) {
            console.error('The API returned an error.', data.error);
            throw new Error();
          }

          // Loop over all notifications to be sent
          var sequence = Promise.resolve();
          data.notifications.forEach(function(notification) {
            sequence = sequence.then(
              self.registration.showNotification(notification.title, {
                body: notification.message,
                data: {url: notification.url},
                icon: notification.icon,
                actions: [  
                   {action: 'reply', title: 'Reply'}
                 ]  
              })
              );
          });
          return sequence;
        });
      }).catch(function(err) {
        console.error('Unable to retrieve data', err);
        return self.registration.showNotification('An error occurred', {
          body: 'We were unable to get the information for this push message',
          icon: '/packages/femiveys_chrome-push-notifications/img/error.png',
          tag: 'notification-error'

        });
      })
    }).catch(function(err) {
      console.error('Error during getSubscription()', err);
    })
  );
}
self.addEventListener('notificationclick', event => {
  console.log('On notification click: ', event.notification.tag);  
  // Android doesn't close the notification when you click on it  
  // See: http://crbug.com/463146  
  event.notification.close();

  // This looks to see if the current is already open and  
  // focuses if it is  
  event.waitUntil(
    clients.matchAll()
    .then(function(clientList) {  
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        console.log('checking client:',client);
        if ('navigate' in client) {
          return client.navigate(event.notification.data.url);
        } else if ('focus' in client) {
          client.url = event.notification.data.url;
          return client.focus();  
        }
      }  
      if (clients.openWindow) {
        return clients.openWindow(self.location.origin+"/"+event.notification.data.url);  
      }
    })
  );
});


//cache

var version = 'v2.0.24:';

var offlineFundamentals = [
  '/',
  '/offline/'
];

//Add core website files to cache during serviceworker installation
var updateStaticCache = function() {
  return caches.open(version + 'fundamentals').then(function(cache) {
    return Promise.all(offlineFundamentals.map(function(value) {
      var request = new Request(value);
      var url = new URL(request.url);
      if (url.origin != location.origin) {
        request = new Request(value, {mode: 'no-cors'});
      }
      return fetch(request).then(function(response) { 
        var cachedCopy = response.clone();
        return cache.put(request, cachedCopy); 
        
      });
    }))
  })
};

//Clear caches with a different version number
var clearOldCaches = function() {
  return caches.keys().then(function(keys) {
      return Promise.all(
                keys
                  .filter(function (key) {
                      return key.indexOf(version) != 0;
                  })
                  .map(function (key) {
                      return caches.delete(key);
                  })
            );
    })
}

/*
  trims the cache
  If cache has more than maxItems then it removes the excess items starting from the beginning
*/
var trimCache = function (cacheName, maxItems) {
    caches.open(cacheName)
        .then(function (cache) {
            cache.keys()
                .then(function (keys) {
                    if (keys.length > maxItems) {
                        cache.delete(keys[0])
                            .then(trimCache(cacheName, maxItems));
                    }
                });
        });
};


//When the service worker is first added to a computer
self.addEventListener("install", function(event) {
  event.waitUntil(updateStaticCache()
        .then(function() { 
          return self.skipWaiting(); 
        })
      );
})

self.addEventListener("message", function(event) {
  var data = event.data;
  
  //Send this command whenever many files are downloaded (ex: a page load)
  if (data.command == "trimCache") {
    trimCache(version + "pages", 25);
    trimCache(version + "images", 10);
    trimCache(version + "assets", 30);
  }
});

//Service worker handles networking
self.addEventListener("fetch", function(event) {

  //Fetch from network and cache
  var fetchFromNetwork = function(response) {
    var cacheCopy = response.clone();
    if (event.request.headers.get('Accept').indexOf('text/html') != -1) {
      caches.open(version + 'pages').then(function(cache) {
        cache.put(event.request, cacheCopy);
      });
    } else if (event.request.headers.get('Accept').indexOf('image') != -1) {
      caches.open(version + 'images').then(function(cache) {
        cache.put(event.request, cacheCopy);
      });
    } else {
      caches.open(version + 'assets').then(function add(cache) {
        cache.put(event.request, cacheCopy);
      });
    }

    return response;
  }

  //Fetch from network failed
  var fallback = function() {
    if (event.request.headers.get('Accept').indexOf('text/html') != -1) {
      return caches.match(event.request).then(function (response) { 
        return response || caches.match('/offline/');
      })
    } else if (event.request.headers.get('Accept').indexOf('image') != -1) {
      return new Response('<svg width="400" height="300" role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/><text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold"><tspan x="93" y="172">offline</tspan></text></g></svg>', { headers: { 'Content-Type': 'image/svg+xml' }});
    } 
  }
  
  //This service worker won't touch non-get requests
  if (event.request.method != 'GET') {
    return;
  }
  
  //For HTML requests, look for file in network, then cache if network fails.
  if (event.request.headers.get('Accept').indexOf('text/html') != -1) {
          event.respondWith(fetch(event.request).then(fetchFromNetwork, fallback));
    return;
      }

  //For non-HTML requests, look for file in cache, then network if no cache exists.
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      return cached || fetch(event.request).then(fetchFromNetwork, fallback);
    })
  ) 
});

//After the install event
self.addEventListener("activate", function(event) {
  event.waitUntil(clearOldCaches()
        .then(function() { 
          return self.clients.claim(); 
        })
      );
});