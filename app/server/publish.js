Meteor.publish(null, function (test, test2){
  if(Roles.userIsInRole(this.userId, "admin") || Roles.userIsInRole(this.userId, "user-admin"))
    return [
		Meteor.roles.find({}),
		Files.find(Meteor.user().profile.picture)
	]
}); //test
