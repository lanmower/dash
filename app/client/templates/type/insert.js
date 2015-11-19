AutoForm.hooks({
  insertTypeForm: {
    onSuccess: function(formType, result) {
      Router.go('typesList');
    }
  }
});
