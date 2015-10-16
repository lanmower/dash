Times = new Mongo.Collection('times');

Times.attachSchema(new SimpleSchema(function() {
  return _.extend({
  in: {
     type: String,
     allowedValues: [
        "in",
        "out",
     ],
     label: "In/Out",
     autoform: {
      type: "select",
      options: [
             {label:"In", value:"in"},
             {label:"out", value:"out"}
        ]
      }
    },
  time:{
    type: Date,
    autoform: {
      afFieldInput: {
        type: "bootstrap-datetimepicker",
        value: new Date()
      }
    }
  },
  lat:{
    denyUpdate: true,
    optional: false,
    type: Number,
     min: -180.0,
     max: 180.0,
     decimal:true,
     autoform: {
       type: "hidden"
     },
   autoValue: function() {
      if (this.isInsert) {
        if(Meteor.users.findOne({_id:this.userId}))
          return Meteor.users.findOne({_id:this.userId}).profile.lat
      } else if (this.isUpsert) {
        return {$setOnInsert: Meteor.users.findOne({_id:this.userId}).profile.lat};
      } else {
      }
    }
  },
  lng:{
    denyUpdate: true,
    optional: false,
    type: Number,
     min: -180.0,
     max: 180.0,
     decimal:true,
     autoform: {
       type: "hidden"
     },
    autoValue: function(self) {
      if (this.isInsert) {
        if(Meteor.users.findOne({_id:this.userId}))
          return Meteor.users.findOne({_id:this.userId}).profile.lng
      } else if (this.isUpsert) {
        return {$setOnInsert: Meteor.users.findOne({_id:this.userId}).profile.lng};
      } else {
      }
    }
  },
}, Meteor.schema())
}
));

Times.allow({
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
