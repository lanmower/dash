Meteor.fieldTypes.push({label:"Date range Input", value: "dateRangeInput"});

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
      return moment(start).format('MMMM Do, YYYY')+" to "+moment(end).format('MMMM Do, YYYY');
    }
  }

Fields.schemas.dateRangeInput = function(data) {
  var name = data.name
  var output = {};
  output[name+"Start"] = {
        type: String,
        label: data.title+" start.",
        autoform: {
          type: "datetimepicker"
        }
    };
    output[name+"End"] = {
          type: String,
          label: data.title+" end.",
          autoform: {
            type: "datetimepicker"
          }
      };
    return output;
  };
