Template.EditWidget.helpers({
  isForm: function(widget) {
    if(widget) return widget.type == "formWidget";
  },
  isWidget: function(widget) {
    if(widget) return true;
  }
});
Template.EditWidget.created = function () {
  var template = this;
  var destroyForm = new ReactiveVar(true);

  Template.EditWidget.helpers({
    destroyForm: function() {
      return destroyForm.get();
    },
  });

  template.autorun(function () {
    destroyForm.set(true);
    console.log(Template.currentData());
  });

  template.autorun(function () {
    if (destroyForm.get()) {
      destroyForm.set(false);
    }
  });
};
