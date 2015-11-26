Template.navbarUsers.helpers({
  users: function () {
    return Meteor.users.find();
  },
  userImage: function (id) {
    var user = Meteor.users.findOne({_id:id});
    if(user && user.profile )return Meteor.users.findOne({_id:id}).profile.picture;
  },
});
Template.navbarUsers.viewmodel({
  user:null,
  select: function () {
    this.user(this);
  },
});
Template.navbarUsers.onCreated(function () {
  Meteor.subscribe("users");
});
