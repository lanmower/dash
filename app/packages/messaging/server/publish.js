Meteor.publish('messages', function () {
  roles = Roles.getRolesForUser(this.userId);
  var tos = [this.userId, 'all'];
  for(var x in roles) {
    tos.push(roles[x]);
  }
  return Messages.find({$or:[{to: {$in:tos}}, {createdBy:this.userId}]}, {sort: {createdAt: -1}, limit: 50});
});
