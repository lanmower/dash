Widgets = new Mongo.Collection("widgets");
Widgets.schemas = {};
Widgets.publishers = {};

Widgets.helpers({
  collectionType: function() {return Widgets},
  parentType: function() {return Pages}
});

Widgets.before.insert(function (userId, doc) {
  doc.createdBy = userId;
});
Widgets.before.update(function (userId, doc, fieldNames, modifier, options) {
  doc.updatedBy = userId;
});
Widgets.before.upsert(function (userId, selector, modifier, options) {
  modifier.$set = modifier.$set || {};
  modifier.$set.updatedBy = userId;
});

Widgets.allow({
  insert: function (userId, widget) {
      return core.can(userId, widget, 'insert');
  },
  update: function (userId, widget, fields, modifier) {
    return core.can(userId, widget, 'update');
  },
  remove: function (userId, widget) {
    return core.can(userId, widget, 'remove');
  }
});
