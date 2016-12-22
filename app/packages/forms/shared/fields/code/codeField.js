Meteor.fieldTypes.push({
  label: "Code field",
  value: "codeField"
});
if (Meteor.isClient) {
  Template.afCodeField.helpers({
    content: function() {
      return AutoForm.getSchemaForField(this.name).autoform.afFieldInput.content;
    }
  });
}

Widgets.schemas.codeField = function() {
  return {
    name: {
      type: String,
      optional: true,
      //autoform: {
      //  type: "hidden"
      //}
    }
  }
};

Meteor.startup(function() {
  if (Meteor.isClient) {
    AutoForm.addInputType("codeField", {
      template: "afCodeField",
    });
  }
});

Fields.schemas.codeField = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
    type: String,
    label: "",
    optional: true,
    autoform: {
      label: " ",
      afFieldInput: {
        type: 'codeField',
        content: data.content,
      }
    }
  };
  return output;

};
