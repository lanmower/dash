Fields = new Mongo.Collection("fields");
Fields.schemas = {};
Fields.hooks = {after:{update:{}, insert:{}, remove:{}}, before:{update:{}, insert:{}, remove:{}}};

Fields.helpers({
  collectionType: function() {return Fields},
  parentType: function() {return Forms}
});

Fields.allow({
  insert: function (userId, widget) {
      return can(userId, widget, 'insert');
  },
  update: function (userId, widget, fields, modifier) {
    return can(userId, widget, 'update');
  },
  remove: function (userId, widget) {
    return can(userId, widget, 'remove');
  }
});
Fields.before.insert(function (userId, doc) {
  doc.createdBy = userId;
});
