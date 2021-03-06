Meteor.fieldTypes.push({
  label: "Checkbox Input",
  value: "checkboxInput"
});

Widgets.schemas.checkboxInput = function() {
  return {
    title: {
      type: String,
      optional: false,
    }
  }
};
Fields.schemas.checkboxInput = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
    type: Boolean,
    optional: true,
    label: data.title ? data.title : ''
  };
  return output;

};
