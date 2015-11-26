Widgets.schemas.textInput = {
    title:{
      type: String,
      optional: false,
    }
  };
Fields.schemas.textInput = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
        type: String,
        label: data.title
      }; return output;
  };
