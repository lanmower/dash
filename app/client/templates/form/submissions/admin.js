Template.submissionsAdmin.created = function () {
  var template = this;
  template.destroyForm = new ReactiveVar(true);
  template.schema = new ReactiveVar(null);

  template.autorun(function () {
    Meteor.subscribe(Template.currentData().collectionName+"-admin");
    Meteor.subscribe("forms");
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
    if(Template[schema['type']].cell) return Template[schema['type']].cell(name, line, schemaOut);
    return line[name];
  },
  user: function(id) {
    return Meteor.users.findOne({_id:id}).profile.name;
  },
  label: function() {
    return this['title'];
  }
});

Widgets.schemas.submissionsAdmin = {
  form:{
    type: String,
    label: "Choose a form",
    autoform: {
      options: function() {
        if (Template.instance().subscriptionsReady()) {
          var forms = Forms.find();
          var ret = [];
          forms.forEach(function(form) {
            ret.push({label:form.title, value:form._id});
          });
          return ret;
        }
      }
    }
  }
};
