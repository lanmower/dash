// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See core-tests.js for an example of importing.
additions = function(self) {
  //no user? only public
  if(!self.userId) {
    return [
      {$and:[
        {"public": true},
        {"public": {$exists: true}}
      ]}
    ];
  }

  //if user test against user roles, can see viewable updatable and removable items
  roles = Roles.getRolesForUser(self.userId);
  if(self.userId) {
    roles.push(Meteor.users.findOne(self.userId)._id);
  }
  var rules = [
    {$or:[
      {"view": {$size: 0}},
      {"view": {$exists: false}}
    ]},
    {view: {$in:roles}},
    {update: {$in:roles}},
    {remove: {$in:roles}},
    {$or: [
      {$and:[
        {createdBy: self.userId},
        {createdBy: {$exists: true}}
      ]},
      {$and:[
        {"public": true},
        {"public": {$exists: true}}
      ]}
    ]}
  ];

  if(self.userId) {
    roles.push(Meteor.users.findOne(self.userId)._id);
    rules.push(
      {$or:[
        {"view": "@"}
      ]}
    );
  }

  if(Roles.userIsInRole(self.userId, "admin"))
    rules.push({_id: {$exists: true}});

  return rules;
};
can = function(userId, item, action, fieldNames) {
  if(Roles.userIsInRole(userId, 'admin')) return true;
  if(action === "update") allow = userId && (item.createdBy === userId);
  if(item.parent) {
    var parentType = item.parentType();
    var parent = parentType.findOne(item.parent);
    if(!parent.createdBy || (userId && (parent.createdBy == userId))) return true;
    for(var i in parent[action]) {
        if(Roles.userIsInRole(userId, item[action][i])) return true;
    }
  }
  for(var i in item.collectionType()._validators[action].allow) {
    if(allowRule(Meteor.userId(), impactedDocument, fieldNames)) {
      return true;
    }
  };
  for(var i in item[action]) {
      if(Roles.userIsInRole(userId, item[action][i])) return true;
  }
}

//find the types that the parent allows, build a label value array
var types = function(parent, parentType, allTypes) {
  var types = [];
  var parent = parentType.findOne({_id: parent});
  if(parent.types)
  for(var type in parent.types) {
    var search = parent.types[type];
    for(var ttype in allTypes) {
      if(search == allTypes[ttype].value) types.push({label:allTypes[ttype].label, value:allTypes[ttype].value})
    }
  }
  else console.log("No types in:",parent);
  return types;
}

//display items have type and parent, as well as field or widget additions
createDisplaySchema = function(parent, type, parentType, allTypes) {
  var tschema = Meteor.schema();
  _.extend(tschema, Meteor.protectSchema());
  tschema.parent = {
    type: String,
    optional:false,
    autoform: {
      type: "hidden",
      value: parent
    }
  },
  tschema.public = {
            type: Boolean,
        };
  tschema.type = {
            type: String,
            optional: false,
            // minCount: 1,
            autoform: {
              type: "select",
              options: types(parent, parentType, allTypes)
            }
        };

  if(type && Widgets.schemas[type]) {
    _.extend(tschema, Widgets.schemas[type](tschema, parent, type, this));
  }
  return tschema;
}


gong = {additions:additions, can:can, createDisplaySchema:createDisplaySchema};
export const name = 'core';
