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
    },
    //getUrl: function() {
    //  return this.url();
    //}
  });
  template.autorun(function () {
    destroyForm.set(true);
    var tschema = Widgets.formSchema(Template.currentData().widget.schema);
    schema.set(new SimpleSchema(tschema));

  });

  template.autorun(function () {
    if (destroyForm.get()) {
      destroyForm.set(false);
    }
  });
};
