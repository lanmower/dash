Meteor.rolesList = function() {
  roles = Meteor.roles.find().fetch();
  var ret = [];
  for(var x in roles) {
    ret.push({label:roles[x].name, value:roles[x].name});
  }
  return ret;
}
