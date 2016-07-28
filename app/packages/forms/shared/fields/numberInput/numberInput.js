Meteor.fieldTypes.push({label:"Number Input", value: "numberInput"});

Widgets.schemas.numberInput = function() {
  return {
    title:{
      type: String,
      optional: false,
    },
    optional:{
      type: Boolean,
    },
    searchable:{
      type: Boolean,
    }
  }
};
Fields.schemas.numberInput = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
        type: Number,
        decimal: true,
        autoform: {
           step: "0.01"
        },
        label: data.title,
        optional: data.optional?true:false
      };
      return output;
  };
