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
    const rootUrl = '/'+event.notification.data.url;
    event.notification.close();
    // Enumerate windows, and call window.focus(), or open a new one.
    if (event.action === 'reply') {  
      clients.openWindow(rootUrl);  
    } else { event.waitUntil(
      clients.matchAll().then(matchedClients => {
        for (let client of matchedClients) {
          if (client.url === rootUrl) {
            return client.focus();
          }
        }
        return clients.openWindow(rootUrl);
      })
    );
    }
    }
  );
