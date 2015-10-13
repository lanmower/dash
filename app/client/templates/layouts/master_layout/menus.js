Template.Menus.helpers({
  menus: function () {
    return Menus.find();
  },
});

Template.Menus.onCreated(function () {
  Meteor.subscribe("menus");
});
