Template.InsertForm.helpers({
    getCol:function() {
      return Forms;
    }
});
AutoForm.hooks({
  insertFormForm: {
    onSuccess: function(formType, result) {
      Router.go('formsList');
    }
  }  ,
    getCol:function() {
      return Forms;
    }

});
