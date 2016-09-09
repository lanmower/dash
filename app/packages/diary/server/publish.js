Widgets.publishers.diary = function(widget, userId) {
  return Diaries.find({user:userId}, {limit: 1, sort: {date: -1}});
};

Meteor.publish('diaries', function () {
  return Diaries.find({user:this.userId});
});

Meteor.publishComposite('diaries-admin', function(path) {
  if(Roles.userIsInRole(this.userId, "admin") ||
     Roles.userIsInRole(this.userId, "diaries-admin"))  return {
    find: function() {
      return Diaries.find();
    },
    children: [
      {
        find: function(diary) {
          return Meteor.users.find(diary.user);
        }
      }
    ]
  };
}
);
