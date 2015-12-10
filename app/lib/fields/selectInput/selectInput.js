Meteor.fieldTypes.push({label:"Select Input", value: "selectInput"});
Widgets.schemas.selectInput = function() {
  return {
    title:{
      type: String,
      optional: false,
    },
    options: {
      type: Array,
      optional: true,
   },
   "options.$": {
      type: String
   }
  }
};
Fields.schemas.selectInput = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
        type: String,
        allowedValues: data.options,
        optional: true,
        label: data.title
      }; return output;
  };
