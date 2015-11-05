//build schema item

schemaItem = function(field) {
  var name = field.name;
  var type = field.type;
  if(Fields.schemas[type]) return Fields.schemas[type](field);
}

processForm = function(id, form) {
  if(form.collectionName && form.type == 'formWidget') {
    if(Meteor.forms[form.collectionName]) return Meteor.forms[form.collectionName];

    var schema = Meteor.schema();
    form.collection = new Mongo.Collection(form.collectionName);
    fields = Fields.find({parent: id});
    fields.forEach(function(item) {
      if(item.name) schema[item.name] = schemaItem(item);
    });
    form.collection.attachSchema(new SimpleSchema(schema));

    Meteor.publish(form.collectionName, function (self) {
      return form.collection.find({
          createdBy: this.userId
        });
    });

    Meteor.publish(form.collectionName+"-admin", function (self) {
      var skip = true;
      if(Roles.userIsInRole(this.userId, "admin")) skip = false;
      if(Roles.userIsInRole(this.userId, form.collectionName+"-admin")) skip = false;
      if(!skip) return form.collection.find({"_id": {$exists: true}});
    });

    form.collection.allow({
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
    Meteor.forms[form.collectionName] = form;
  }
}
