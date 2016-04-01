Approvals = new Mongo.Collection('approvals');
Approvals.helpers({
  collectionType: function() {return Approvals}
});

Approvals.attachSchema(new SimpleSchema(_.extend({
  form:{
    type: String,
    optional: false,
  },
  field:{
    type: String,
    optional: false,
  },
  doc:{
    type: String,
    optional: false,
  },
  user:{
    type: String,
    optional: false,
  },
  value:{
        type: Boolean,
        optional: false,
  },
}, Meteor.schema())));

Approvals.allow({
  insert: function (userId, widget) {
      return true;
  },
  update: function (userId, widget, fields, modifier) {
    return true;
  },
  remove: function (userId, widget) {
      return true;
  }
});
