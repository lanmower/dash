Widgets.schemas.dateTimeInput = {
    title:{
      type: String,
      optional: false,
    }
  };

  if(Meteor.isClient) {
    Template.dateTimeInput.cell = function(name, item, schema) {
      var time = item[name];
      console.log(time, item, name, schema);
      return moment(time).format('MMMM Do, YYYY');
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
