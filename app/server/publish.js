Meteor.publish(null, function (test, test2){
  if(Roles.userIsInRole(this.userId, "admin") || Roles.userIsInRole(this.userId, "user-admin"))
    return [
		Meteor.roles.find({}),
		Meteor.users.find(this.userId)
	]
}); //test
