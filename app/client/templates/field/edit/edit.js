Template.EditField.helpers({
  schema: function() {
    var formSchema = createDisplaySchema(this.field.parent, this.field.type, Widgets);
    formSchema.name = {type:String};
    return formSchema;
  }
});
