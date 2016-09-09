  
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
      //denyInsert: true,
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
      //denyInsert: true,
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
