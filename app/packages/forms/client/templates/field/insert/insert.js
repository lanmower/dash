Template.InsertField.helpers({
  schema: function() {
    var formSchema = new SimpleSchema(gong.createDisplaySchema(Router.current().params.parent, null, Forms, Meteor.fieldTypes));
    formSchema.name = {type:String};
    return formSchema;
  }  ,
    getCol:function() {
      return Fields;
    }

});

AutoForm.hooks({
  insertFieldForm: {
    onSuccess: function(formType, result) {
      Router.go('editField', {"form":Router.current().params.parent,"_id":result});
    }
  }
});
