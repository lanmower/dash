Template.EditField.helpers({
  schema: function() {
    var formSchema = {};
    _.extend(
      formSchema,
      core.createDisplaySchema(this.parent, this.type, Forms, Meteor.fieldTypes));
    formSchema.listable = {
      type: Boolean,
      label: "Display in list?"
    };
    return new SimpleSchema(formSchema);
  },
  getCol:function() {
    
    return Fields;
  }
});
