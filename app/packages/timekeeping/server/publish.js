
Meteor.publish('punches', function () {
  var additions = gong.additions(this);
  return Punches.find({$or:additions});
});

Meteor.publish('punch', function (id) {
  var additions = gong.additions(this);
  return Punches.find({_id: id,$or:additions});
});
