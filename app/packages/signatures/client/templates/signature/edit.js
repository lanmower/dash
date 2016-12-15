Template.EditSignature.events({
    "click .setSignatureButton": function (event) {
      Meteor.call('setSignature', this.signature._id, function(error, result) {
          console.log(error, result);
      });
      Router.go('signatureStatus', {_id:this.signature._id});
    }
  });
