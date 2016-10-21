/*Cpn = {};


Cpn.serviceWorkerRegistration = function () {
  console.log("serviceWorkerRegistration called");

  subscribe();
  console.log(navigator);

  // Check that service workers are supported, if so, progressively  
  // enhance and add push messaging support, otherwise continue without it.  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(initialiseState);
  } else {
    console.warn('Service workers aren\'t supported in this browser.');
  }
}

// Once the service worker is registered set the initial state  
initialiseState = function () {
  console.log("initialiseState");

  // Are Notifications supported in the service worker?  
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    console.warn('Notifications aren\'t supported.');
    return;
  }

  // Check the current Notification permission.  
  // If its denied, it's a permanent block until the  
  // user changes the permission  
  if (Notification.permission === 'denied') {
    console.warn('The user has blocked notifications.');
    return;
  }

  // Check if push messaging is supported  
  if (!('PushManager' in window)) {
    console.warn('Push messaging isn\'t supported.');
    return;
  }

  // We need the service worker registration to check for a subscription  
  navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
    // Do we already have a push message subscription?  
    serviceWorkerRegistration.pushManager.getSubscription()
      .then(function (subscription) {
        if (!subscription) {
          return;
        }

        // Keep your server in sync with the latest subscriptionId
        console.log(subscription);
        Meteor.call('gcmSubscription', subscription, function (r, e) {console.log(r, e);});
      })
      .catch(function (err) {
        console.warn('Error during getSubscription()', err);
      });
  });
}

function subscribe() {
  navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly:true})
      .then(function (subscription) {
        // The subscription was successful
        // TODO: Send the subscription.endpoint to your server  
        // and save it to send a push message at a later date
        console.log(subscription);
        Meteor.call('gcmSubscription', subscription, function (r, e) {console.log(r, e);});
        //return sendSubscriptionToServer(subscription);
      })
      .catch(function (e) {
        if (Notification.permission === 'denied') {
          // The user denied the notification permission which  
          // means we failed to subscribe and the user will need  
          // to manually change the notification permission to  
          // subscribe to push messages  
          console.warn('Permission for Notifications was denied');
        } else {
          // A problem occurred with the subscription; common reasons  
          // include network errors, and lacking gcm_sender_id and/or  
          // gcm_user_visible_only in the manifest.  
          console.error('Unable to subscribe to push.', e);
        }
      });
  });
}*/