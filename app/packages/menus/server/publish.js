
Meteor.publish('menus', function () {
  var additions = gong.additions(this);
  return Menus.find({$or:additions});
});

Meteor.publish('menu', function (id) {
  var additions = gong.additions(this);
  return Menus.find({_id: id,$or:additions});
});
