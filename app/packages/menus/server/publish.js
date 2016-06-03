Meteor.publish('menus', function () {
  var additions = Menus.additions(this);
  return Menus.find({$or:additions});
});

Meteor.publish('menu', function (id) {
  var additions = Menus.additions(this);
  return Menus.find({_id: id,$or:additions});
});
