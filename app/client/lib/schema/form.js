formSchema = function(form) {

  var fields = Fields.find({parent:form._id},{sort: { listposition: 1 }});

  var schema = Meteor.schema();
  fields.forEach(function(field) {
    //if(field.name) {
      var name = field.name;
      si = schemaItem(field);
      _.each(si, function(value, key, obj) {
        schema[key] = value;
      });
    //}
  });
  return schema;
}