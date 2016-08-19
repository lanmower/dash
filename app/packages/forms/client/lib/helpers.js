getCollection = function(_id) {
  var form = Meteor.forms[_id];
  if(!form) {
    var form = {};
      form.data = Forms.findOne(_id);
      if(form && form.data) {
        form.collection = new Mongo.Collection(form.data.collectionName);
        Meteor.forms[_id] = form;
      }
    }
  

  if(form && form.data) {
    if(!form) {
       throw new Meteor.Error(404,name+" not found.");
    }
    return Meteor.forms[_id].collection;
  }
}

Template.registerHelper("getCollection", function() {
  return getCollection(this.formId);
});

listSchema = function(form) {
  var fields = Fields.find({parent:form},{sort: { listposition: 1 }});
  return fields.fetch();
}
