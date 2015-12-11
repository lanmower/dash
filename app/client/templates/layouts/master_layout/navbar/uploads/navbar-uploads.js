Template.navbarUploads.helpers({
  uploads: function() {
    return Files.find({uploadedAt:{$exists:true}}).fetch();
  }
});
Template.navbarUploads.created = function(){
  this.autorun(function() {
    Meteor.subscribe("uploads");
  });
}

Template.navbarUploads.open = false;
