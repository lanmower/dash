if(Meteor.isServer)  {
  Meteor.publish("formFiles", function (form, id) {
    var form = Meteor.forms[form];
    fields = [];
    if(!form) return false;
    Fields.find({parent: form._id,type:"fileUpload"}).forEach(function (field) {
      fields.push(field.name);
    });
    return Files.find({"metadata.parentId":id, "metadata.collectionName":form.collectionName,"metadata.field":{$in:fields}});
  });
}
