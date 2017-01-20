Widgets.publishers.diary = function(widget, userId) {
  return Diaries.find({user:userId, date:{$exists:true}}, {limit: 1, sort: {date: -1}});
};

Meteor.publish('diary', function(id) {
  var selector = {_id:id, date:{$exists:true}, user: this.userId};
  return Diaries.find(selector);
});
Meteor.publish('diary-admin', function(id) {
  return Diaries.find({_id:id, date:{$exists:true}});
});

ReactiveTable.publish('diaries', Diaries, function () {
  return {user: this.userId};
}, {enableRegex: true});

ReactiveTable.publish("diaries-admin", Diaries, function () {
  var protection = {user: this.userId,  date:{$exists:true}};
  if(Roles.userIsInRole( this.userId, 'admin' )) return {};
  else return protection;
});

