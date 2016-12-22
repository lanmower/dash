Template.navbarUploads.helpers({
  uploads: function() {
    return Files.find().fetch();
  }
});
Template.navbarUploads.created = function() {
  var template = this;
  this.autorun(function() {
    template.subscribe("uploads");
  });
}
Template.navbarUploads.events({
  "click .clear": function() {
    FS.HTTP.uploadQueue.cancel();
    Files.find().forEach(function(item) {
      if (!item.isUploaded()) {
        Files.remove({
          _id: item._id
        });
      }
    });
  }
});

Template.navbarUploads.open = false;
