/*Meteor.fieldTypes.push({label:"Currency Input", value: "currencyInput"});

Widgets.schemas.currencyInput = function() {
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

Fields.schemas.currencyInput = function(data) {
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
*/
