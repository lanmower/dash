Messages = new Mongo.Collection('messages');

Messages.attachSchema(new SimpleSchema(_.extend({
  to:{
    type: [String],
    label: "To",
    max: 200
  },
  subject:{
    type: String,
    label: "Subject",
    max: 200,
    optional: true
  },
  body:{
    type: String,
    label: "Body",
    max: 200
  },
  read:{
    type: [String],
    autoValue: function () {
      if (this.isInsert) {
        return [];
      } else if (this.isUpsert) {
        return {$setOnInsert: []};
      } else {
        this.unset();
      }
    },
  },
}, Meteor.schema())));

Messages.allow({
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
if (Meteor.isServer) {
  Messages.after.insert(function (userId, doc)  {
    var user = Meteor.users.findOne(userId);
    if(user) name = user.profile.name;

    //notify(name, doc.body, doc.to, "messages/"+userId);
    Meteor.call("notify", name, doc.body, doc.to, "messages/"+userId);
  });
}

