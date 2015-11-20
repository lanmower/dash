AutoForm.hooks({
  submitForm: {
    onSuccess: function(formType, result) {
      var route = Router.current().params.parent;
      Router.go('submissions', {form:Router.current().params.form});
    }
  }
});

Template.submitForm.created = function () {
  var template = this;
  template.destroyForm = new ReactiveVar(true);
  template.schema = new ReactiveVar(null);

  template.autorun(function () {
    template.destroyForm.set(true);
    if(Template.currentData()) {
      template.schema.set(formSchema(Template.currentData()));
    }
  });

  template.autorun(function () {
    if (template.destroyForm.get()) {
      template.destroyForm.set(false);
    }
  });
};

Template.submitForm.helpers({
  destroyForm: function() {
    if(Template.instance().destroyForm)
    return Template.instance().destroyForm.get();
  },
  getSchema: function() {
    if(Template.instance().schema) {
      return new SimpleSchema(Template.instance().schema.get());
    }
  }
});
