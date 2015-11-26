can = function(userId, item, action) {
  if(action === "update") allow = userId && (item.createdBy === userId);
  if(item.parent) {
    var parentType = item.parentType();
    var parent = parentType.findOne(item.parent);
    if(!parent.createdBy || (userId && (parent.createdBy == userId))) return true;
    for(var i in parent[action]) {
        if(Roles.userIsInRole(userId, item[action][i])) return true;
    }
  }
  for(var i in item[action]) {
      if(Roles.userIsInRole(userId, item[action][i])) return true;
  }
}

//display items have type and parent, as well as field or widget additions
createDisplaySchema = function(parent, type, parentType) {
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
  tschema.type = {
            type: String,
            optional: false,
            // minCount: 1,
            autoform: {
              type: "select",
              options: types(parent, parentType)
            }
        };

  if(type && Widgets.schemas[type]) {
    _.extend(tschema, Widgets.schemas[type]);
  }
  return tschema;
}



//find the types that the parent allows, build a label value array
var types = function(parent, parentType) {
  var types = [];
  var allTypes = Types.find().fetch();
  var parent = parentType.findOne({_id: parent});
  for(var type in parent.types) {
    var search = parent.types[type];
    for(var ttype in allTypes) {
      if(search == allTypes[ttype].value) types.push({label:allTypes[ttype].label, value:allTypes[ttype].value})
    }
  }
  return types;
}

Meteor.schema = function() {
  return _.extend({},{
    createdBy: {
      type: String,
      autoform: {
          type: "hidden",
          label: false
      },
      autoValue: function() {
        if (this.isInsert) {
          return this.userId;
        } else if (this.isUpsert) {
          return {$setOnInsert: this.userId};
        } else {
          this.unset();
        }
      }
    },
    updatedBy: {
      type: String,
      autoform: {
          type: "hidden",
          label: false
      },
      autoValue: function() {
        if (this.isUpdate) {
          return this.userId;
        }
      },
      denyInsert: true,
      optional: true
    },
    createdAt: {
    type: Date,
    autoform: {
        type: "hidden",
        label: false
    },
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();
      }
    }
  },
  // Force value to be current date (on server) upon update
  // and don't allow it to be set upon insert.
  updatedAt: {
    type: Date,
    autoform: {
        type: "hidden",
        label: false
    },
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  }
  });
};

Meteor.protectSchema = function() {
  return _.extend({},{
    view:{
          type: [String],
          optional: true,
          // minCount: 1,
          autoform: {
            type: "universe-select",
            afFieldInput: {
              multiple: true,
              options: function () {
                console.log('test');
                return Meteor.rolesList();
              }
            }
          }
      },
      update:{
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
        },
        remove:{
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
  });
};
