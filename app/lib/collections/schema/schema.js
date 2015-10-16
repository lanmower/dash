schemaItem = function(orig) {
  var name = orig.name;
  var type = orig.type;
  //delete schemaItem["name"];
  //delete schemaItem["type"];
  if(type == "Date") {
    return {"type": Date,"autoform":{
      afFieldInput: {
        type: "bootstrap-datetimepicker",
        value: new Date()
      }
    }
  };
  }
  if(type == "Editor") {
    return {
      "type": String,
      autoform: {
        afFieldInput: {
          type: 'summernote',
        }
      }
    };
  }

  if(type == "String") return {"type":String};
  if(type == "File") {
    return {
      "type":String,
      "autoform":{
        afFieldInput: {
          type: "cfs-file",
          collection: "files"
        }
      }
    };
  }
}

Meteor.schema = function() {
  return _.extend({},{
    createdBy: {
      type: String,
      autoform: {
          type: "hidden",
          label: false
      },
      autoValue: function () {
        return Meteor.userId()
      },
    },
    createdAt: {
       type: Date,
       autoform: {
         value: new Date(),
         type: "hidden"
       },
       autoValue: function(doc, operation) {
         if (this.isInsert) {
           return new Date();
         } else if (this.isUpsert) {
           return {$setOnInsert: new Date()};
         } else {
           this.unset();
         }
       }
   },

   updatedAt: {
       type: Date,
       autoform: {
         value: new Date(),
         type: "hidden"
       },
       autoValue: function(doc, operation) {
         if (this.isInsert) {
           return new Date();
         } else if (this.isUpsert) {
           return {$setOnInsert: new Date()};
         } else {
           this.unset();
         }
       }
   }
  });
};

Meteor.protectSchema = function() {
  return _.extend({},{
    public:{
      type: Boolean,
      label: "Visible: Public",
      max: 200
    },
    signedIn:{
      type: Boolean,
      label: "Visible: Signed in",
      max: 200
    },
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
