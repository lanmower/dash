Template.EditField.helpers({
  /*schema: function() {
    var formSchema = {name:{type:String}};
    _.extend(
      formSchema,
      gong.createDisplaySchema(this.field.parent, this.field.type, Forms, Meteor.fieldTypes));
    formSchema.listable = {
      type: Boolean,
      label: "Display in list?"
    };
    return new SimpleSchema(formSchema);
  }
  ,*/
  getCol:function() {
    return Fields;
  }
});
