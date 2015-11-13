var listSchemaItem = function(field) {
  if(field.listable) return field;
}

listSchema = function(form, admin) {
  var fields = Fields.find({parent:form._id},{sort: { listposition: 1 }});
  var schema = [];
  fields.forEach(function(field) {
    if(field.name) {
      var item = listSchemaItem(field);
      if(item) schema.push(item);
    }
  });

  return schema;
}
