Meteor.publish('tasks', function () {
  var additions = gong.additions(this);
  
  return Tasks.find({$or:[{createdBy:this.userId}, {assign:this.userId}]});
});

Meteor.publish('task', function (id) {
  var additions = gong.additions(this);
  return Tasks.findOne({$or:[{createdBy:this.userId}, {assign:this.userId}]});
});
