Template.EditField.helpers({
  schema: function() {
    var formSchema = createDisplaySchema(this.field.parent, this.field.type, Widgets);
    formSchema.name = {type:String};
    formSchema.listable = {
      type: Boolean,
      label: "Display in list?"
    };
    return new SimpleSchema(formSchema);
  }
});
