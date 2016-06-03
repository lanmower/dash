Template.submissionsAdmin.created = function () {
  var template = this;
  template.destroyForm = new ReactiveVar(true);
  template.schema = new ReactiveVar(null);

  template.autorun(function () {
    template.subscribe(Template.currentData().collectionName+"-admin");
    template.subscribe("forms");
    template.destroyForm.set(true);
    template.schema.set(listSchema(Template.currentData(), true));
  });

  template.autorun(function () {
    if (template.destroyForm.get()) {
      template.destroyForm.set(false);
    }
  });
};

Template.submissionsAdmin.helpers({
  destroyForm: function() {
    return Template.instance().destroyForm.get();
  },
  getSchema: function() {
    var schema = [];
    if(Template.instance().schema) {
      var base = Template.instance().schema.get();
      for(var x in base) {
        if(base[x].listable) schema.push(base[x]);
      }
    }
    return schema;
  },
  items: function() {
    var name = this.collectionName;
    var collection = getCollection(name);
    return collection.find();
  },
  cell: function(line, schema) {
    var name = schema['name'];
    var allSchema = Template.instance().schema.get();
    var schemaOut = {};
    for(var x in allSchema) {
      schemaOut[allSchema[x].name] = allSchema[x];
    }
    if(Template[schema['type']] && Template[schema['type']].cell) return Template[schema['type']].cell(name, line, schemaOut);
    return line[name];
  },
  user: function(id) {
    user = Meteor.users.findOne({_id:id});
    if(user && user.profile && user.profile.name) return Meteor.users.findOne({_id:id}).profile.name;
  },
  label: function() {
    return this['title'];
  }
});
