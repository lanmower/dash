Widgets.schemas.selectInput = {
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
  };
Fields.schemas.selectInput = function(data) {
      return {
        type: String,
        allowedValues: data.options,
        optional: true,
        label: data.title
      }
  };
