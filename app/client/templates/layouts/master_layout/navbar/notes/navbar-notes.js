Template.navbarNotes.helpers({
});

Template.navbarNotes.onCreated(function () {
  Meteor.subscribe("notes");
});

Template.navbarNotes.open = false;
