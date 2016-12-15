Signatures = new Mongo.Collection('signatures');

Signatures.attachSchema(new SimpleSchema(_.extend({
  title:{
    type: String,
    label: "Title",
    max: 200
  },
  'signature': {
      type: String,
      autoform: {
        afFieldInput: {
          type: 'summernote',
        }
      },
      optional: true
  },
  'users': {
    type: [String],
    optional: true,
    autoform: {
      //type: "universe-select",
      allowedValues: function() {
        return _.map(Meteor.usersList(), function(data){
              return data.value;
            });
      },
      afFieldInput: {
        multiple: true,
        options: function () {
          return Meteor.usersList();
        }
      }
    }
  }
}, Meteor.schema())));


Signatures.allow({
  insert: function (userId, widget) {
    if(Roles.userIsInRole(userId, ["admin", "signatures-admin"])) return true;
  },
  update: function (userId, widget, fields, modifier) {
    if(Roles.userIsInRole(userId, ["admin", "signatures-admin"])) return true;
  },
  remove: function (userId, widget) {
    if(Roles.userIsInRole(userId, ["admin", "signatures-admin"])) return true;
  }
});
