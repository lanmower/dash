Pages = new Mongo.Collection('pages');
Pages.helpers({
  collectionType: Pages
});

Pages.attachSchema(new SimpleSchema(_.extend({
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

  }, Meteor.schema(), Meteor.protectSchema()
)));

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
