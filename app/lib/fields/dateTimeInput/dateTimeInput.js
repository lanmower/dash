Widgets.schemas.dateTimeInput = {
    title:{
      type: String,
      optional: false,
    }
  };

  if(Meteor.isClient) {
    Template.dateTimeInput.cell = function(name, item, schema) {
      var time = item[name];
      return time.format('MMMM Do, YYYY');
    }
  }

Fields.schemas.dateTimeInput = function(data) {
      return {
        type: Date,
        label: data.title,
        autoform: {
          type: "bootstrap-datetimepicker"
        }
      }
  };
