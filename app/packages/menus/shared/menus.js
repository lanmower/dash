Menus = new Mongo.Collection('menus');

Menus.attachSchema(new SimpleSchema(_.extend({
  title:{
    type: String,
    label: "Title",
    max: 200
  },
  'item': {
        type: [Object],
        optional: false
  },
  'item.$.title' :{
      type: String,
      label: "Title",
      max: 200
  },
  'item.$.path': {
      type: String,
      label: "Path",
      max: 200
  },
'item.$.view':{
        type: [String],
        optional: true,
        // minCount: 1,
        autoform: {
          type: "universe-select",
          afFieldInput: {
            multiple: true,
            options: function () {
              return Meteor.rolesList();
            }
          }
        }
    }
}, Meteor.schema(), Meteor.protectSchema())));

if (Meteor.isServer) {
  Menus.allow({
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
