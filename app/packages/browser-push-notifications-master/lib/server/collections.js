//////////////////
// Subscritopns //
//////////////////

bpSubscriptions.attachSchema(new SimpleSchema({
  subscription_id: {
    type: String,
  },
  owner: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue: function() {
      if (this.isInsert) {
        return Meteor.userId();
      }
    }
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    },
    denyUpdate: true,
    optional: true,
  }
}));

bpSubscriptions.getSubscriptionIds = function(userIds) {
  var selector = {
    owner: {
      $in: userIds
    }
  };
  var options = {
    fields: {
      subscription_id: 1,
      _id: 0
    }
  };
  return bpSubscriptions.find(selector, options).map(function(subscription) {
    return subscription.subscription_id;
  });
};

bpSubscriptions.getOwners = function(subscriptionIds) {
  var selector = {
    subscription_id: {
      $in: subscriptionIds
    }
  };
  var options = {
    fields: {
      owner: 1,
      _id: 0
    }
  };
  return bpSubscriptions.find(selector, options).map(function(subscription) {
    return subscription.owner;
  });
};

bpSubscriptions.requestUsersPush = function(userIds) {
  var registrationIds = bpSubscriptions.getSubscriptionIds(userIds);
  if (registrationIds.length > 0) bpSubscriptions.requestPush(registrationIds);
};

bpSubscriptions.requestPush = function(registrationIds) {

  var key = BrowserPushNotifications.key;
  if (!key) {
    throw new Meteor.Error('key-error', 'You didn\'t set the Google API key. See server output.');
  }
  var url = 'https://android.googleapis.com/gcm/send';
  var options = {
    headers: {
      'Authorization': 'key=' + key,
      'Content-Type': 'application/json'
    },
    data: {
      registration_ids: registrationIds,
    }
  };

  HTTP.post(url, options, function(error, result) {
    if (error) {
      throw new Meteor.Error('api-error',
        'Error while trying to contact google.' + error, error);
    }
  });
};

bpSubscriptions.broadcast = function(notification) {
  // Get all the subscriptions in the DB
  subscriptionIds = bpSubscriptions.find().map(function(subscription) {
    return subscription.subscription_id;
  });

  // Insert a notificataion for all owners of the subscriptions
  bpSubscriptions.getOwners(subscriptionIds).forEach(function(userId) {
    bpNotifications.insert(_.extend(notification, {
      owner: userId
    }));
  });

  // Finally request a push for all the subscriptions
  bpSubscriptions.requestPush(subscriptionIds);
}
