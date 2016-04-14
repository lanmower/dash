Meteor.fieldTypes.push({label:"Date/Time Input", value: "dateRangeInput"});

Widgets.schemas.dateRangeInput = function() {
  return {
    title:{
      type: String,
      optional: false,
    }
  }
};

  if(Meteor.isClient) {
    Template.dateRangeInput.cell = function(name, item, schema) {
      var start = item[name+"-start"];
      var end = item[name+"-end"];
      return moment(start).format('MMMM Do, YYYY')+moment(end).format('MMMM Do, YYYY');
    }
  }

Fields.schemas.dateRangeInput = function(data) {
  var name = data.name
  var output = {};
  output[name+"-start"] = {
        type: String,
        label: data.title,
        autoform: {
          type: "datetimepicker"
        }
    };
    output[name+"-end"] = {
          type: String,
          label: data.title,
          autoform: {
            type: "datetimepicker"
          }
      };
    return output;
  };
