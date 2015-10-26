Types = new Mongo.Collection('types');
Types.attachSchema(new SimpleSchema(_.extend({
  label:{
    type: String,
    label: "Label",
    max: 200
  },
  value:{
    type: String,
    label: "Value",
    max: 200
  },
  template: {
      type: String,
      label: "Widget content",
      optional: true,
  },
  js:{
    type: String,
    optional: true,
    label: "Js",
    max: 200
  }
}, Meteor.schema())));

Types.allow({
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
