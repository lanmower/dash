Template.updateForm.created = function () {
  var template = this;
  var destroyForm = new ReactiveVar(true);
  var schema = new ReactiveVar(null);

  Template.updateForm.helpers({
    destroyForm: function() {
      return destroyForm.get();
    },
    getSchema: function() {
      return schema.get();
    },
    getFile: function(parent) {
      if(this.type == "File" && parent.form) {
        fileId = parent.form[this.name];
        return Files.findOne({_id:fileId});
      }
    }
  });

  template.autorun(function () {
    destroyForm.set(true);
    schema.set(formSchema(Template.currentData().widget.schema));
  });

  template.autorun(function () {
    if (destroyForm.get()) {
      destroyForm.set(false);
    }
  });
};
