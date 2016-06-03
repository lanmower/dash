AutoForm.hooks({
  insertFormForm: {
    onSuccess: function(formType, result) {
      Router.go('formsList');
    }
  }
});
