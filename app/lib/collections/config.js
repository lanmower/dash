Config = new Mongo.Collection('config');

Config.attachSchema(new SimpleSchema(_.extend({
  key:{
    type: String,
    label: "Key",
    max: 200
  },
  value:{
    type: String,
    label: "Value",
  },
}, Meteor.schema(), Meteor.protectSchema())));

if (Meteor.isServer) {
  Config.allow({
    insert: function (userId, doc) {
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return true;
    }
  });
}
