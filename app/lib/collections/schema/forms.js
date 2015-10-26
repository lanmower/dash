//build schema item
schemaItem = function(field) {
  var name = field.name;
  var type = field.type;
  console.log("Making schema item:",field);
  if(Fields.schemas[type]) return Fields.schemas[type](field);
  /*f(type == "Date") {
    return {"type": Date,"autoform":{
      afFieldInput: {
        type: "bootstrap-datetimepicker",
        value: new Date()
      }
    }
  };
  }
  if(type == "Editor") {
    return {
      "type": String,
      autoform: {
        afFieldInput: {
          type: 'summernote',
        }
      }
    };
  }

  if(type == "textInput") ;
  if(type == "File") {
    return {
      "type":String,
      "autoform":{
        afFieldInput: {
          type: "cfs-file",
          collection: "files"
        }
      }
    };
  }*/
}

processForm = function(id, form) {
  if(form.collectionName && form.type == 'formWidget') {
    if(Meteor.forms[form.collectionName]) return Meteor.forms[form.collectionName];

    console.log("Building form for:", id);
    var schema = Meteor.schema();
    form.collection = new Mongo.Collection(form.collectionName);
    fields = Fields.find({parent: id});
    console.log("Found fields", fields.fetch());
    fields.forEach(function(item) {
      schema[item.name] = schemaItem(item);
    });
    console.log("Processing form with schema:", schema);
    form.collection.attachSchema(new SimpleSchema(schema));

    console.log("Publishing collection:", form.collectionName);
    Meteor.publish(form.collectionName, function (self) {
      return form.collection.find(function(self) {
        return {createdBy: self.userId};
      });
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
