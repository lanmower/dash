Meteor.methods({
  // Subscriptions
  bpSend: function(notification, userIds) {
    check(notification, {
      title: String,
      message: Match.Optional(String),
      icon: Match.Optional(String),
      url: Match.Optional(String)//,
      //actions: Match.Maybe([Object])
    });

    // If userIds is not set, default it to the current user
    if(!userIds) {
      userIds = [Meteor.userId()];
    }

    // If userIds is not an Array, we make it an array
    if(!Array.isArray(userIds)) {
      userIds = [userIds];
    }

    console.log(notification, userIds);
    // We save the notification to be sent for every user in the db
    userIds.forEach(function(userId, index, array) {
      bpSubscriptions.find({owner:userId}).forEach(function(doc) {
        console.log("subscription",doc._id);
        bpNotifications.insert(_.extend(notification, {owner: userId, subscription_id:doc.subscription_id}));
      })
    });

    // Finally we send the push request to the cloud for all subscriptions
    // corresponding to the userIds
    bpSubscriptions.requestUsersPush(userIds);
  },
  saveSubscription: function(subscriptionId) {
    var doc = {
      subscription_id: subscriptionId,
      owner: Meteor.userId()
    }
    return bpSubscriptions.upsert(doc, {$set: doc});
  },
  removeSubscription: function(subscriptionId) {
    return bpSubscriptions.remove({ subscription_id: subscriptionId })
  }
});



