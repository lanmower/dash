if (!Meteor.isCordova) {
  bpSubscriptions = new Meteor.Collection('bp_subscriptions');
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
    Meteor.call("bpSend", notification, userIds);
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

}