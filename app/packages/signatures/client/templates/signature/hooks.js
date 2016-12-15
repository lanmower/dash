AutoForm.hooks({
  insertSignatureForm: {
    onSuccess: function(formType, result) {
      Router.go('signaturesList');
    }
  },
  updateSignatureForm: {
    onSuccess: function(formType, result) {
      Router.go('signaturesList');
    }
  }
});
