Meteor.rolesList = function() {
  users = Meteor.users.find().fetch();

  roles = Meteor.roles.find().fetch();
  var ret = [];
  for(var x in roles) {
    ret.push({label:roles[x].name, value:roles[x].name});
  }
  for(var x in users) {
    ret.push({label:users[x].profile.name, value:users[x]._id});
  }
  return ret;
}
Meteor.roles.allow({
	  insert: function (userId) { if(Roles.userIsInRole(userId, ["admin", "role-admin"])) return true; },
	  remove: function (userId) { if(Roles.userIsInRole(userId, ["admin", "role-admin"])) return true; },
    update: function (userId, role) {
      if(Roles.userIsInRole(userId, ["admin", "role-admin"])) return true;
    }
});
