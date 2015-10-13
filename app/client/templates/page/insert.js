AutoForm.hooks({
  insertPageForm: {
    onSuccess: function(formType, result) {
      Router.go('pagesList');
    }
  }
});
