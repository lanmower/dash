Template.InsertWidget.helpers({
  schema: function() {
    return new SimpleSchema(core.createDisplaySchema(Router.current().params.parent, null, Pages, Meteor.widgetTypes));
  },
  getCol:function() {
    return Widgets;
  }
});

Template.InsertWidget.onCreated(function(){
  var subs = this.subscribe("page",Router.current().params.parent);
});

AutoForm.hooks({
  insertWidgetForm: {
    onSuccess: function(formType, result) {
      Router.go('editPage', {"_id":Router.current().params.parent});
    }
  }
});
