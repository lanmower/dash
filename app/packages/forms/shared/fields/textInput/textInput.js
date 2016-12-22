Meteor.fieldTypes.push({
  label: "Text Input",
  value: "textInput"
});

Widgets.schemas.textInput = function() {
  return {
    title: {
      type: String,
      optional: false,
    },
    optional: {
      type: Boolean,
    },
    searchable: {
      type: Boolean,
    }
  }
};
Fields.schemas.textInput = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
    type: String,
    label: data.title,
    optional: data.optional ? true : false
  };
  return output;
};
