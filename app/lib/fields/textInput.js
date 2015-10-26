Widgets.schemas.textInput = {
    title:{
      type: String,
      optional: false,
    }
  };
Fields.schemas.textInput = function(data) {
      return {
        type: String,
        label: data.title
      }
  };
