Meteor.fieldTypes.push({label:"Date range Input", value: "dateRangeInput"});

Fields.hooks.after.startup.leaveTrigger = function(form, formField) {
  var start = new Date();
  var run = function() {
    Fiber(function() {
      var end = new Date() - start;
      _.each(form.collection.find().fetch(), function(item) {
      });
    }).run();
  };
  run();
  setInterval(run, 20000);
};

Widgets.schemas.dateRangeInput = function() {
  return {
    title:{
      type: String,
      optional: false,
    }
  }
};

  if(Meteor.isClient) {
    Template.dateRangeInput.cell = function(name, item, schema, field) {
      var start = item[name+"-start"];
      var end = item[name+"-end"];
      return moment(start).format('MMMM Do, YYYY')+" to "+moment(end).format('MMMM Do, YYYY');
    }
  }

Fields.schemas.dateRangeInput = function(data) {
  var name = data.name
  var output = {};
  output[name+"Start"] = {
        type: Date,
        label: data.title+" start.",
        autoform: {
          type: "datetimepicker"
        }
    };
    output[name+"End"] = {
          type: Date,
          label: data.title+" end.",
          autoform: {
            type: "datetimepicker"
          }
      };
    return output;
  };
