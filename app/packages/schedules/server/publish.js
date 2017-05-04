
Meteor.publish('schedules', function () {
  var additions = core.additions(this);
  return Schedules.find({$or:additions});
});

Meteor.publish('schedule', function (id) {
  var additions = core.additions(this);
  return Schedules.find({_id: id,$or:additions});
});
