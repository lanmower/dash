Types = new Mongo.Collection('types');
Types.attachSchema(new SimpleSchema({
  label:{
    type: String,
    label: "Label",
    max: 200
  },
  value:{
    type: String,
    label: "Value",
    max: 200
  },
  template: {
      type: String,
      label: "Widget content",
      optional: true,
  },
  js:{
    type: String,
    optional: true,
    label: "Js",
    max: 200
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

}));

Types.allow({
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
