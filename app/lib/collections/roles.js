Meteor.rolesList = function() {
  roles = Meteor.roles.find().fetch();
  var ret = [];
  for(var x in roles) {
    ret.push({label:roles[x].name, value:roles[x].name});
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
