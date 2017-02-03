Template.Menus.helpers({
  menus: function () {
    return Menus.find();
  },
});

Template.Menus.onCreated(function () {
  this.subscribe("menus");
});