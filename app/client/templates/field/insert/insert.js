Template.InsertField.helpers({
  schema: function() {
    var formSchema = new SimpleSchema(createDisplaySchema(Router.current().params.parent, null, Forms, Meteor.fieldTypes));
    formSchema.name = {type:String};
    return formSchema;
  }
});

Template.InsertField.onCreated(function(){
  var subs = this.subscribe("form",Router.current().params.parent);
});

AutoForm.hooks({
  insertFieldForm: {
    onSuccess: function(formType, result) {
      Router.go('editField', {"_id":result});
    }
  }
});
