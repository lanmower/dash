
Meteor.publish('punches', function () {
  var additions = core.additions(this);
  return Punches.find({$or:additions});
});

Meteor.publish('punch', function (id) {
  var additions = core.additions(this);
  return Punches.find({_id: id,$or:additions});
});
