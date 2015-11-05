Template.InsertWidget.helpers({
  schema: function() {
    return new SimpleSchema(createDisplaySchema(Router.current().params.parent, null, Pages));
  }
});

Template.InsertWidget.onCreated(function(){
  var subs = this.subscribe("page",Router.current().params.parent);
  Meteor.subscribe("types");
});

AutoForm.hooks({
  insertWidgetForm: {
    onSuccess: function(formType, result) {
      Router.go('editPage', {"_id":Router.current().params.parent});
    }
  }
});
