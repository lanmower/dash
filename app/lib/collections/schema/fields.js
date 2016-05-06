Fields = new Mongo.Collection("fields");
Fields.schemas = {};
Fields.hooks = {after:{update:{}, insert:{}, remove:{}, startup:{}}, before:{update:{}, insert:{}, remove:{}}};

Fields.helpers({
  collectionType: function() {return Fields},
  parentType: function() {return Forms}
});

Fields.allow({
  insert: function (userId, widget) {
      return true;//can(userId, widget, 'insert');
  },
  update: function (userId, widget, fields, modifier) {
    return true;// can(userId, widget, 'update');
  },
  remove: function (userId, widget) {
    return true;// can(userId, widget, 'remove');
  }
});
/*Fields.before.insert(function (userId, doc) {
  doc.createdBy = userId;
});*/
