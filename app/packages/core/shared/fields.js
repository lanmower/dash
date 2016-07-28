Fields = new Mongo.Collection("fields");
Fields.schemas = {};
Fields.hooks = {after:{update:{}, insert:{}, remove:{}, startup:{}}, before:{update:{}, insert:{}, remove:{}}};

Fields.helpers({
  collectionType: function() {return fields},
  parentType: function() {return Forms}
});

Fields.allow({
  insert: function (userId, widget) {
      return gong.can(userId, widget, 'insert');
  },
  update: function (userId, widget, fields, modifier) {
    return  gong.can(userId, widget, 'update');
  },
  remove: function (userId, widget) {
    return gong.can(userId, widget, 'remove');
  }
});
