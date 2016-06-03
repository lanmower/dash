AutoForm.hooks({
  submitForm: {
    onSuccess: function(formType, result) {
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
      console.log(template.schema.get());
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
  getCollection: function() {
    var form = Forms.findOne({_id:Router.current().params.form});
    return getCollection(form.collectionName);
  },
  getSchema: function() {
    if(Template.instance().schema) {
      return new SimpleSchema(Template.instance().schema.get());
    }
  }
});
