listSchema = function(form, admin) {
  var fields = Fields.find({parent:form._id},{sort: { listposition: 1 }});
  return fields.fetch();
}
