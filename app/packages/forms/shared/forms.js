Forms = new Mongo.Collection('forms');
Forms.helpers({
  collectionType: function() {return Forms}
});

Forms.attachSchema(new SimpleSchema(_.extend({
  title:{
    type: String,
    optional: false,
  },
  collectionName:{
    type: String,
    optional: false,
  },
  types:{
        type: [String],
        autoform: {
          type: "universe-select",
          afFieldInput: {
            multiple: true,
            options: function () {
              return Meteor.fieldTypes;
            }
          }
        }
    },
    "types.$": {
          type: String,
          optional: true,
      },
}, Meteor.schema())));

Forms.allow({
  insert: function (userId, widget) {
      return true;
  },
  update: function (userId, widget, fields, modifier) {
    return true;
  },
  remove: function (userId, widget) {
      return true;
  }
});
