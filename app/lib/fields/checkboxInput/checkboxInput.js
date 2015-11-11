Widgets.schemas.checkboxInput = {
    title:{
      type: String,
      optional: false,
    }
  };
  Fields.schemas.checkboxInput = function(data) {
    return {
      type: Boolean,
      label: data.title?data.title:''
    }
  };
