SubscriptionManager = function(pushButton) {
  return {
    subscribe: function() {
      navigator.serviceWorker.ready
      .then(subscribePushSubscription)
      .then(activateSubscription)
      .catch(function(e) {
        console.error(e)
      })
    },
    unsubscribe: function() {
      navigator.serviceWorker.ready
      .then(subscribePushSubscription) // TODO: this is strange
      .then(deactivateSubscription)
      .catch(function(e) {
        console.error(e)
      })
    }
  };


  //////////////////////
  // Helper functions //
  //////////////////////
  /**
   * Get the subscription
   * @param  {serviceWorkerRegistration}
   * @return {Promise.PushSubscription}
   */
  function subscribePushSubscription(serviceWorkerRegistration) {
    return serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true});
  }

  /**
   * Sets all data for an active subscription
   * @param  {PushSubscription} pushSubscription
   * @return {[type]}
   */
  function activateSubscription(subscription) {
    console.log(subscription);
    subscription.subscriptionId = subscription.endpoint.split('https://android.googleapis.com/gcm/send/')[1];
 
    // Save subscription on the server
    Meteor.call('saveSubscription', subscription.subscriptionId);

    // Set cookies so we know to whom the subscription belongs

    // Make sure we know the subscription is enabled
    Session.set('isPushEnabled', true);

    // Log some feedback
    console.log('subscribed');
  }

  function deactivateSubscription(subscription) {
    if (!subscription) {
      return;
    }

    // Unsubscribe
    subscription.unsubscribe();

    // Remove subscription from the server
    Meteor.call('removeSubscription', subscription.subscriptionId);

    // Make sure we know the subscription is disabled
    Session.set('isPushEnabled', false);

    // Log some feedback
    console.log('unsubscribed')
  }
}

