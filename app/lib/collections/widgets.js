Widgets = new Mongo.Collection("widgets");
Widgets.schemas = {};
Widgets.formSchemas = {};
Widgets.helpers({
  collectionType: Widgets,
  parentType: Pages
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

var types = function (pageId) {
  var types = [];
  var allTypes = Types.find().fetch();
  //get all the types from the page, and list them using the information in the Types collection.
  var page = Pages.findOne({_id: pageId});
  for(var type in page.types) {
    var search = page.types[type];
    for(var ttype in allTypes) {
      if(search == allTypes[ttype].value) types.push({label:allTypes[ttype].label, value:allTypes[ttype].value})
    }
  }
  return types;
}
Widgets.doSchema = function(parent, type) {
  var schema = Meteor.schema();
  schema.parent= {
    type: String,
    optional:false,
    autoform: {
      type: "hidden",
      value: parent
    }
  },
  schema.type = {
            type: String,
            optional: false,
            // minCount: 1,
            autoform: {
              type: "select",
              options: types(parent)
            }
        };
  if(type) _.extend(schema, Widgets.schemas[type]);
  return new SimpleSchema(schema);
}

can = function(userId, item, action) {
  if(action === "update") allow = userId && (item.createdBy === userId);
  if(item.parent) {
    var parentType = item.parentType;
    var parent = parentType.findOne(item.parent);
    if(!parent.createdBy || (userId && (parent.createdBy == userId))) return true;
    for(i in parent[action]) {
        if(Roles.userIsInRole(userId, item[action][i])) return true;
    }
  }
  for(i in item[action]) {
      if(Roles.userIsInRole(userId, item[action][i])) return true;
  }
}

Widgets.allow({
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
