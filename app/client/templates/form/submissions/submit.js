AutoForm.hooks({
  submitForm: {
    onSuccess: function(formType, result) {
      Router.go('submissions', {_id:Router.current().params._id});
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
