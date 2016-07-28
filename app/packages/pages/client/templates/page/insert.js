Template.InsertPage.helpers({
  getCol:function() {
    return Pages;
  }
});

AutoForm.hooks({
  insertPageForm: {
    onSuccess: function(formType, result) {
      Router.go('pagesList');
    }
  }
});
