Template.EditField.helpers({
  schema: function() {
    var formSchema = {name:{type:String}};
    _.extend(
      formSchema,
      createDisplaySchema(this.field.parent, this.field.type, Forms));
    formSchema.listable = {
      type: Boolean,
      label: "Display in list?"
    };
    return new SimpleSchema(formSchema);
  }
});
