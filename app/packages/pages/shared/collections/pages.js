
Pages = new Mongo.Collection('pages');
Pages.helpers({
  collectionType: function() {return Pages}
});

Pages.attachSchema(new SimpleSchema(_.extend({
  title:{
    type: String,
    label: "Title",
    max: 200
  },
  path:{
    type: String,
    label: "Path",
    max: 200
  },
  types:{
        type: [String],
        optional: true,
        // minCount: 1,
        autoform: {
          type: "universe-select",
          afFieldInput: {
            multiple: true,
            options: function () {
              return Meteor.widgetTypes;
            }
          }
        }
    },

  }, Meteor.schema(), Meteor.protectSchema()
)));

Pages.allow({
  insert: function (userId, page) {
      return gong.can(userId, page, 'insert');
  },
  update: function (userId, page, fields, modifier) {
    return gong.can(userId, page, 'update');
  },
  remove: function (userId, page) {
    return gong.can(userId, page, 'remove');
  }
});
