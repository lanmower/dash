Widgets.schemas.editorInput = function() {
  return {
    title:{
      type: String,
      optional: false,
    }
  }
};
Fields.schemas.editorInput = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
        "type": String,
        autoform: {
          afFieldInput: {
            type: 'summernote',
          }
        }
      };
      return output;
  };
