Times = new Mongo.Collection('times');
Times.attachSchema(new SimpleSchema({
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
           type: "hidden"
       },
       autoValue: function(doc, operation) {
         if (this.isInsert) {
           return new Date()
         } else if (this.isUpsert) {
           return {$setOnInsert: new Date()};
         } else {
           this.unset();
         }
       }
   },
    updatedAt: {
        type: Date,
        autoform: {
          type: "hidden",
          value: Date()
        },
        autoValue: function(doc, operation) {
            if (operation === 'update')
                return new Date();
        }
    }

}));

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
