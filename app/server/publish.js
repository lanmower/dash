Meteor.publish(null, function (){
  if(Roles.userIsInRole(this.userId, "admin") || Roles.userIsInRole(this.userId, "user-admin"))
    return Meteor.roles.find({})
}); //test
