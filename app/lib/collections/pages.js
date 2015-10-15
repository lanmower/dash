Pages = new Mongo.Collection('pages');
Pages.helpers({
  collectionType: Pages
});

Pages.attachSchema(new SimpleSchema({
  title:{
    type: String,
    label: "Title",
    max: 200
  },
  path:{
    type: String,
    label: "Path",
    max: 200
  },
  types:{
        type: [String],
        optional: true,
        // minCount: 1,
        autoform: {
          type: "universe-select",
          afFieldInput: {
            multiple: true,
            options: function () {
              return Types.find({}, {}).fetch();
            }
          }
        }
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

  }
));

Pages.allow({
  insert: function (userId, page) {
      var allow = userId && (page.createdBy === userId);
      if(allow == false){
          var currentUser = Meteor.user();
          for(i in page.insert) {
              if(Roles.userIsInRole(currentUser, i)) return true;
          }
      }
      return allow;
  },
  update: function (userId, page, fields, modifier) {
      var allow = userId && (page.createdBy === userId);
      if(allow == false){
        var currentUser = Meteor.user();
        for(i in page.update) {
            if(Roles.userIsInRole(currentUser, page.update[i])) return true;
        }
      }
    return allow;
  },
  remove: function (userId, page) {
      var allow = userId && (page.createdBy === userId);
      if(allow == false){
          var currentUser = Meteor.user();
          for(i in page.remove) {
              if(Roles.userIsInRole(currentUser, i)) return true;
          }
      }
      return allow;
  }
});
