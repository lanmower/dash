Diaries = new Mongo.Collection('diaries');
Types.attachSchema(new SimpleSchema(_.extend({
  diary:{
    type: String,
    label: "Label",
    max: 200
  }
}, Meteor.schema())));

Diaries.allow({
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
