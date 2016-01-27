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
Template.navbarUploads.events = {
  "click .clear": function() {
    var list = FS.HTTP.uploadQueue.processList.fetch();
    _.each(list, function(item) {
      item.queue.cancel();
    });
    Files.find().forEach(function(item) {
      if (!item.isUploaded()) {
            Files.remove({_id: item._id});
      }
    });
  }
};

Template.navbarUploads.open = false;
