Widgets.schemas.dateTimeInput = {
    title:{
      type: String,
      optional: false,
    }
  };
Fields.schemas.dateTimeInput = function(data) {
      return {
        type: Date,
        label: data.title,
        autoform: {
          type: "bootstrap-datetimepicker"
        }
      }
  };
