Template.InsertWidget.helpers({
  getWidgets: function() {
    var schema = Widgets.doSchema(Router.current().params.parent);
    return true;
  }
});

Template.InsertWidget.onCreated(function(){
  var subs = this.subscribe("page",Router.current().params.parent);
  Meteor.subscribe("types");
});
AutoForm.hooks({
  insertWidgetForm: {
    onSuccess: function(formType, result) {
      console.log(result);
      Router.go('editPage', {"_id":Router.current().params.parent});
    }
  }
});
