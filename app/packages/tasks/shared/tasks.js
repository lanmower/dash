Tasks = new Mongo.Collection('tasks');

Tasks.attachSchema(new SimpleSchema(_.extend({
  'title': {
    type: String,
    label: "Title",
    max: 200
  },
  'description': {
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'summernote',
      }
    },
    label: "Description",
    max: 200
  },
  complete: {
    type: 'Hidden',
    optional: true,
    autoform: {
      type: "hidden"
    }
  },
  assign: {
    type: [String],
    optional: true,
    label: 'Assign',
    allowedValues: function() {
      return _.map(Meteor.usersList(), function(item) {
        return item.value;
      });
    },
    autoform: {
      type: "universe-select",
      afFieldInput: {
        multiple: true,
        options: function() {
          return Meteor.usersList();
        }
      }
    }
  }
}, Meteor.schema(), Meteor.protectSchema())));

if (Meteor.isServer) {
  Tasks.allow({
    insert: function(userId, doc) {
      return true;
    },

    update: function(userId, doc, fieldNames, modifier) {
      var isOwner = doc && doc.createdBy === userId;
      if (!userId) {
        return false;
      }
            console.log(userId, doc, fieldNames, modifier);
      return true;
    },

    remove: function(userId, doc) {
      return true;
    }
  });
}
