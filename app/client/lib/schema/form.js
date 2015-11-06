formSchema = function(form) {
  
  var fields = Fields.find({parent:form._id},{sort: { listposition: 1 }});

  var schema = Meteor.schema();
  fields.forEach(function(field) {
    if(field.name) {
      var name = field.name;
      schema[name] = schemaItem(field);
    }
  });
  return schema;
}
