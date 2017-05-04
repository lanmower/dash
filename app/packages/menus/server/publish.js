
Meteor.publish('menus', function () {
  var additions = core.additions(this);
  return Menus.find({$or:additions});
});

Meteor.publish('menu', function (id) {
  var additions = core.additions(this);
  return Menus.find({_id: id,$or:additions});
});
