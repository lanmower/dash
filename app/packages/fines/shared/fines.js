Fines = new Mongo.Collection('fines');
Fines.attachSchema(new SimpleSchema(_.extend({
  amount:{
    type: String,
    label: "Title",
    max: 200
  },
  assign: {
    type: [String],
    optional: true,
    label: 'Assign',
    allowedValues: function() {
      return _.map(Meteor.usersList(), function(item) {
        return item.value;
      });
    },
    autoform: {
      type: "universe-select",
      afFieldInput: {
        multiple: true,
        options: function() {
          return Meteor.usersList();
        }
      }
    }
  }

}, Meteor.schema(), Meteor.protectSchema())));
