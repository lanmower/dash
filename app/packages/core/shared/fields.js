Fields = new Mongo.Collection("fields");
scheduled = new Mongo.Collection("scheduled");
 
Fields.schemas = {};
Fields.hooks = {after:{update:{}, insert:{}, remove:{}, startup:{}}, before:{update:{}, insert:{}, remove:{}}};

Fields.helpers({
  collectionType: function() {return Fields},
  parentType: function() {return Forms}
});

Fields.allow({
  insert: function (userId, widget) {
      return core.can(userId, widget, 'insert');
  },
  update: function (userId, widget, fields, modifier) {
    return  core.can(userId, widget, 'update');
  },
  remove: function (userId, widget) {
    return core.can(userId, widget, 'remove');
  }
});
