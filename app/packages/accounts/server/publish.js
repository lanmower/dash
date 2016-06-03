Meteor.publish('roles', function () {
  if(Roles.userIsInRole(this.userId, "admin")) return Meteor.roles.find();
});
