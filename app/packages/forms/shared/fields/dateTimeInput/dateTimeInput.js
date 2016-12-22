Meteor.fieldTypes.push({
  label: "Date/Time Input",
  value: "dateTimeInput"
});

Widgets.schemas.dateTimeInput = function() {
  return {
    title: {
      type: String,
      optional: false,
    }
  }
};

if (Meteor.isClient) {
  Template.dateTimeInput.cell = function(schema, item) {
    var time = item[schema.name];
    return moment(time).format('MMMM Do, YYYY');
  }
}

if (Meteor.isClient) {
  Template.afDatetimepicker.helpers({
    optsDatetimepicker: function() {
      return {
        //WHAT IS STORED (i.e in the database)
        //formatValue: 'YYYY-MM-DD HH:MM',
        pikaday: {
          //what is DISPLAYED (to the user)
          format: 'MMM D, YYYY HH:MM',
          showTime: true,
        }
      }
    }
  });
}

Fields.schemas.dateTimeInput = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
    type: String,
    label: data.title,
    autoform: {
      type: "datetimepicker"
    }
  };
  return output;

};
