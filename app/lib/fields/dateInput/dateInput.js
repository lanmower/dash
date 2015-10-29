Widgets.schemas.dateInput = {
    title:{
      type: String,
      optional: false,
    }
  };
Fields.schemas.dateInput = function(data) {
      return {
        type: Date,
        label: data.title,
        autoform: {
          type: "bootstrap-datepicker"
        }
      }
  };
