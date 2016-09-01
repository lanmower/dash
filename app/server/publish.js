Meteor.publish(null, function (test, test2){
	console.log(this);
  if(Roles.userIsInRole(this.userId, "admin") || Roles.userIsInRole(this.userId, "user-admin"))
    return Meteor.roles.find({})
}); //test
