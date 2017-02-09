schemaItem = function(field) {
  var ret;
  if (Fields.schemas[field.type]) ret = Fields.schemas[field.type](field);
  return ret;
}

String.prototype.trim = function(){
	return this.replace(/^\s+|\s+$/g, "");
};

String.prototype.toCamel = function(){
	return this.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
};

String.prototype.toUnderscore = function(){
	return this.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
};

formSchema = function(form) {

  var fields = Fields.find({
    parent: form._id
  }, {
    sort: {
      listposition: 1
    }
  });

  var schema = Meteor.schema();
  fields.forEach(function(field) {
    //if(field.name) {
    var name = field.name.trim().toCamel().toUnderscore();
    si = schemaItem(field);
    _.each(si, function(value, key, obj) {
      schema[key] = value;
    });
    //}
  });
  return schema;
}
