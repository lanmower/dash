Template.formWidget.created = function () {
  var template = this;
  var destroyForm = new ReactiveVar(true);
  var schema = new ReactiveVar(null);
  Template.formWidget.helpers({
    destroyForm: function() {
      return destroyForm.get();
    },
    getSchema: function() {
      return schema.get();
    }
  });

  template.autorun(function () {
    destroyForm.set(true);
    schema.set(formSchema(Template.currentData()));
  });

  template.autorun(function () {
    if (destroyForm.get()) {
      destroyForm.set(false);
    }
  });
};
