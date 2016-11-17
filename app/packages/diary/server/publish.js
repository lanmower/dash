Widgets.publishers.diary = function(widget, userId) {
  return Diaries.find({user:userId}, {limit: 1, sort: {date: -1}});
};

ReactiveTable.publish('diaries', Diaries, function () {
  //return {createdBy: this.userId};
  return {};
}, {enableRegex: true});

ReactiveTable.publish("diaries-admin", Diaries, function () {
  var protection = {createdBy: this.userId};
  if(Roles.userIsInRole( this.userId, 'admin' )) return {};
  else return protection;
});

