/////////////////////////////////
// Push notifications checkbox //
/////////////////////////////////
Template.bpNotificationsCheckbox.onRendered(function() {
  registerServiceWorker();
});

Template.bpNotificationsCheckbox.events({
  'click #push-button': function (evt) {
    var subscriptionManager = SubscriptionManager(evt.currentTarget);
    console.log(evt.currentTarget.checked);
    if (evt.currentTarget.checked == true) {
      console.log("subscribing");
      subscriptionManager.subscribe();
    } else {
      console.log("unsubscribing");
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


