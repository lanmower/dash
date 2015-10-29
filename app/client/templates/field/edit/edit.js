Template.EditField.helpers({
  schema: function() {
    var formSchema = createDisplaySchema(this.field.parent, this.field.type, Widgets);
    console.log(formSchema);
    formSchema.name = {type:String};
    return new SimpleSchema(formSchema);
  }
});
