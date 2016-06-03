Meteor.publish('diaries', function () {
  return Diaries.find({user:this.userId});
});
Meteor.publish('diaries-admin', function () {
  if(Roles.userIsInRole(this.userId, "admin") ||
     Roles.userIsInRole(this.userId, "diaries-admin")) return Meteor.roles.find();
  return Diaries.find();
});
