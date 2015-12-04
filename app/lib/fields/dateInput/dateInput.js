Widgets.schemas.dateInput = function() {
  return {
    title:{
      type: String,
      optional: false,
    }
  }
};
Fields.schemas.dateInput = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
      type: Date,
      label: data.title,
      autoform: {
        type: "bootstrap-datepicker"
      }
  };
  return output;
};
