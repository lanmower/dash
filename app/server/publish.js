Meteor.publish(null, function (){
  if(Roles.userIsInRole(self.userId, "admin") || Roles.userIsInRole(self.userId, "user-admin"))
    return Meteor.roles.find({})
});
