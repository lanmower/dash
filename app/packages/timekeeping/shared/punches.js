Punches = new Mongo.Collection('Punches');

Punches.attachSchema(new SimpleSchema(_.extend({
  time: {
    type: Date,
    autoform: {
        type: "datetime",
        disabled: true
    },
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    }
  },
  creatorName: {
    type: String,
    autoform: {
        type: "hidden"
    },
    autoValue: function() {
      if (this.isInsert) {
        return Meteor.user().profile.name;
      } else if (this.isUpsert) {
        return {$setOnInsert: Meteor.user().profile.name};
      } else {
        this.unset();
      }
    }
  },
  location: {
    type: String,
    autoform: {
        type: "mapInput",
        disabled: true
    },
  },
  'note': {
      type: String,
      label: "Note",
      max: 200
  }
}, Meteor.schema(), Meteor.protectSchema())));

if (Meteor.isServer) {
  Punches.allow({
    insert: function (userId, doc) {
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      console.log(fieldNames, modifier);
      return true;
    },

    remove: function (userId, doc) {
      return false;
    }
  });
}
