Template.navbarUploads.helpers({
  uploads: function() {
    return Files.find().fetch();
  }
});
Template.navbarUploads.created = function(){
  this.autorun(function() {
    Meteor.subscribe("uploads");
  });
}

Template.navbarUploads.open = false;
