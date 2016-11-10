bpNotifications = new Meteor.Collection('bp_notifications');

bpNotifications.attachSchema(new SimpleSchema({
  title: { type: String },
  message: {
    type: String,
    optional: true,
  },
  icon: {
    type: String,
    optional: true,
  },
  url: {
    type: String,
    optional: true,
  },
  'actions.$': {
    type: Object,
    optional:true
  },
  'actions.$.text': {
    type: String,
    optional:true
  },
  'actions.$.url': {
    type: String,
    optional:true
  },
  callbackAt: {
    optional: true,
    type: Date,
  },
  owner: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue: function() {
      if(!this.isSet) {
        if (this.isInsert) {
          return Meteor.userId();
        }
      }
    },
    denyUpdate: true,
  },
  subscription_id: {
    type: String,
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    },
    denyUpdate: true,
  }
}));


/**
 * Send a notification to self, one or more users
 * If userId is omitted, the notification will be pushed to the current user
 * @param  {Object} notification
 * @param  {string|string[]} [userIds]
 */
bpNotifications.send = function(notification, userIds) {
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
      bpNotifications.insert(_.extend(notification, {owner: userId, subscription_id:doc.subscription_id}));
    })
  });

  // Finally we send the push request to the cloud for all subscriptions
  // corresponding to the userIds
  Meteor.call('requestPushNotification', userIds);
}

/**
 * Gets a list of all notifications that have not been requested for yet
 * @param  {string} subscriptionId
 * @param  {string} userId
 * @returns {[Object]}
 */
bpNotifications.getNotifications = function(notificationId, userId) {
  var notifications = bpNotifications.find(notificationId).fetch();

  if(!notifications) {
    throw new Meteor.Error('notification not found',
           'Subscription with subscriptionId= ' + subscriptionId + 'not found');
  }

  return notifications;
};


/**
 * Send a push notification to all subscriptions.
 * DANGEROUS Has to be used with caution.
 * @param  {[type]}
 * @return {[type]}
 */
bpNotifications.broadcast = function(notification) {
  Meteor.call('broadcastPushNotification', notification);
}

bpNotifications.allow({
  insert: function (userId, item) {
      return true;
  },
  update: function (userId, item, fields, modifier) {
    return  true;
  },
  remove: function (userId, item) {
    return true;
  }
});

