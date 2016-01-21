Template.EditUser.events({
    'click .setSignatureButton': function(event, instance) {
      event.stopPropagation();
      Meteor.call("setSignature", this._id);
    },
});


Template.EditUser.helpers({
  profile: function() {
    return Meteor.user();
  }
});
