Messages = new Mongo.Collection('messages');

Messages.attachSchema(new SimpleSchema({
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

 updatedAt: {
     type: Date,
     optional: true,
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
}
