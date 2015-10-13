Widgets = new Mongo.Collection("widgets");
Widgets.schemas = {};
Widgets.formSchemas = {};
Widgets.schema = {
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
     autoform: {
       value: new Date(),
       type: "hidden"
     },
     autoValue: function(doc, operation) {
       if (this.isInsert) {
         return new Date();
       } else if (this.isUpsert) {
         return {$setOnInsert: this.userId};
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
         return {$setOnInsert: this.userId};
       } else {
         this.unset();
       }
     }
 }
};

var types = function (pageId) {
  var types = [];
  var allTypes = Types.find().fetch();
  //get all the types from the page, and list them using the information in the Types collection.
  var page = Pages.findOne({_id: pageId});
  for(var type in page.types) {
    var search = page.types[type];
    for(var ttype in allTypes) {
      if(search == allTypes[ttype].value) types.push({label:allTypes[ttype].label, value:allTypes[ttype].value})
    }
  }
  return types;
}
Widgets.doSchema = function(parent, type) {
  var schema = Widgets.schema;
  schema.parent= {
    type: String,
    optional:false,
    autoform: {
      type: "hidden",
      value: parent
    }
  },
  schema.type = {
            type: String,
            optional: false,
            // minCount: 1,
            autoform: {
              type: "select",
              options: types(parent)
            }
        };
  if(type) jQuery.extend(schema, Widgets.schemas[type]);
  return new SimpleSchema(schema);
}

Widgets.allow({
  insert: function (userId, widget) {
      var allow = userId && (widget.createdBy === userId);
      if(allow == false){
          var currentUser = Meteor.user();
          for(i in widget.insert) {
              if(Roles.userIsInRole(currentUser, i)) return true;
          }
      }
      return allow;
  },
  update: function (userId, widget, fields, modifier) {
      var allow = userId && (widget.createdBy === userId);
      if(allow == false){
        var currentUser = Meteor.user();
        for(i in widget.update) {
            if(Roles.userIsInRole(currentUser, widget.update[i])) return true;
        }
      }
    return allow;
  },
  remove: function (userId, widget) {
      var allow = userId && (widget.createdBy === userId);
      if(allow == false){
          var currentUser = Meteor.user();
          for(i in widget.remove) {
              if(Roles.userIsInRole(currentUser, i)) return true;
          }
      }
      return allow;
  }
});
