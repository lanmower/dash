Widgets.schemas.editorInput = {
    title:{
      type: String,
      optional: false,
    }
  };
Fields.schemas.editorInput = function(data) {
      return {
        "type": String,
        autoform: {
          afFieldInput: {
            type: 'summernote',
          }
        }
      }
  };
