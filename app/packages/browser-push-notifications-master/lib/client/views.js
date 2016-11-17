/////////////////////////////////
// Push notifications checkbox //
/////////////////////////////////
Template.bpNotificationsCheckbox.onRendered(function() {
  registerServiceWorker();
});

Template.bpNotificationsCheckbox.events({
  'click #push-button': function (evt) {
    var subscriptionManager = SubscriptionManager(evt.currentTarget);
    if (evt.currentTarget.checked == true) {
      subscriptionManager.subscribe();
    } else {
      subscriptionManager.unsubscribe();
    }
  }
})

Template.bpNotificationsCheckbox.helpers({
  label: function() {
    if(this.label) {
      return this.label;
    } else {
      return "Enable Push notifications";
    }
  },
  classes: function() {
    if(this.class) {
      return this.class;
    } else {
      return;
    }
  }
});


