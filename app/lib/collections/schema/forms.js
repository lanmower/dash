//build schema item

schemaItem = function(field) {
  var name = field.name;
  var type = field.type;
  if(Fields.schemas[type]) return Fields.schemas[type](field);
}
