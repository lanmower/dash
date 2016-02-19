Template.navbarNotes.helpers({
});

Template.navbarNotes.onCreated(function () {
  this.subscribe("notes");
});

Template.navbarNotes.open = false;
