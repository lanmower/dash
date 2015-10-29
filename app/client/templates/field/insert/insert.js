Template.InsertField.helpers({
  schema: function() {
    var formSchema = new SimpleSchema(createDisplaySchema(Router.current().params.parent, null, Widgets));
    formSchema.name = {type:String};
    return formSchema;
  }
});

Template.InsertField.onCreated(function(){
  var subs = this.subscribe("widget",Router.current().params.parent);
  Meteor.subscribe("types");
});

AutoForm.hooks({
  insertItemForm: {
    onSuccess: function(formType, result) {
      console.log(result);
      Router.go('editWidget', {"_id":Router.current().params.parent});
    }
  }
});
