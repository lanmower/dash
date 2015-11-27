//build schema item

schemaItem = function(field) {
  var ret;
  if(Fields.schemas[field.type]) ret = Fields.schemas[field.type](field);
  console.log(ret);
  return ret;
}
