Menus = new Mongo.Collection('menus');

Menus.attachSchema(new SimpleSchema({
  title:{
    type: String,
    label: "Title",
    max: 200
  },
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
        },
  'item': {
        type: [Object],
        optional: false
  },
  'item.$.title' :{
      type: String,
      label: "Title",
      max: 200
  },
  'item.$.path': {
      type: String,
      label: "Path",
      max: 200
  },
  createdBy: {
    type: String,
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
  createdAt: {
       type: Date,
       denyUpdate: true,
       optional: false,
       autoform: {
         value: new Date(),
         type: "hidden"
       },
       autoValue: function(doc, operation) {
           if (operation === 'insert')
               return new Date();
       }
   },

   updatedAt: {
       type: Date,
       autoform: {
         value: new Date(),
         type: "hidden"
       },
       autoValue: function(doc, operation) {
           if (operation === 'update')
               return new Date();
       }
   }

}));

if (Meteor.isServer) {
  Menus.allow({
    insert: function (userId, doc) {
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return true;
    }
  });
}
