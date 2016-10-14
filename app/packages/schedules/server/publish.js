
Meteor.publish('schedules', function () {
  var additions = gong.additions(this);
  return Schedules.find({$or:additions});
});

Meteor.publish('schedule', function (id) {
  var additions = gong.additions(this);
  return Schedules.find({_id: id,$or:additions});
});
