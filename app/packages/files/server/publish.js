
Meteor.publish("formFiles", function (form, id) {
  console.log("SUBSCRIBING TO FILES", form, id);
  var form = Meteor.forms[form];
  fields = [];
  if(!form) return false;
  console.log("SUBSCRIBING TO FILES", Fields.find({parent: form._id,type:"fileUpload"}).fetch());
  Fields.find({parent: form._id,type:"fileUpload"}).forEach(function (field) {
    fields.push(field.name);
  });
  console.log("SUBSCRIBING TO "+Files.find({"metadata.parentId":id, "metadata.formId":form._id,"metadata.field":{$in:fields}}).count()+ " FILES");
  return Files.find({"metadata.parentId":id, "metadata.formId":form._id,"metadata.field":{$in:fields}});
});
