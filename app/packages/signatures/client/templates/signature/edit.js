Template.EditSignature.helpers({
  beforeRemove: function () {
    return function (collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Really delete "' + doc.title + '"?')) {
        Router.go('editForm',Router.current().params);
        this.remove();
      }
    };
  }
});
Template.EditSignature.events({
    "click .setSignatureButton": function (event) {
      Meteor.call('setSignature', this.signature._id, function(error, result) {
          console.log(error, result);
      });
      Router.go('signatureStatus', {_id:this.signature._id});
    }
  });
