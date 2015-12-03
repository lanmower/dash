Widgets.schemas.dateTimeInput = function() {
  return {
    title:{
      type: String,
      optional: false,
    }
  }
};

  if(Meteor.isClient) {
    Template.dateTimeInput.cell = function(name, item, schema) {
      var time = item[name];
      console.log(time, item, name, schema);
      return moment(time).format('MMMM Do, YYYY');
    }
  }

if(Meteor.isClient) {
  Template.dateTimeInput.helpers({
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
    };      return output;

  };
