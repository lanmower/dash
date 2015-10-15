Meteor.schema = function() {
  return _.extend({},{
    createdBy: {
      type: String,
      autoform: {
          type: "hidden",
          label: false
      },
      autoValue: function () {
        return Meteor.userId()
      },
    },
    createdAt: {
       type: Date,
       autoform: {
         value: new Date(),
         type: "hidden"
       },
       autoValue: function(doc, operation) {
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
       autoform: {
         value: new Date(),
         type: "hidden"
       },
       autoValue: function(doc, operation) {
         if (this.isInsert) {
           return new Date();
         } else if (this.isUpsert) {
           return {$setOnInsert: new Date()};
         } else {
           this.unset();
         }
       }
   }
  });
};
