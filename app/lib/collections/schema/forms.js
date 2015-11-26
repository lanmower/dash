//build schema item

schemaItem = function(field) {
  var ret;
  console.log(Fields.schemas[field.type](field));
  if(Fields.schemas[field.type]) ret = Fields.schemas[field.type](field);
  console.log(ret);
  return ret;
}
