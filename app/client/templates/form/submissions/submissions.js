Template.submissions.created = function () {
  var template = this;
  template.destroyForm = new ReactiveVar(true);
  template.schema = new ReactiveVar(null);

  template.autorun(function () {
    Meteor.subscribe(Template.currentData().collectionName);
    Meteor.subscribe("forms");
    template.destroyForm.set(true);
    template.schema.set(listSchema(Template.currentData()));
  });

  template.autorun(function () {
    if (template.destroyForm.get()) {
      template.destroyForm.set(false);
    }
  });
};

Template.submissions.helpers({
  destroyForm: function() {
    return Template.instance().destroyForm.get();
  },
  getSchema: function() {
    if(Template.instance().schema) return Template.instance().schema.get();
  },
  currentForm: function() {
    return Router.current().params.form;
  },
  items: function() {
    var name = this.collectionName;
    var collection = getCollection(name);
    return collection.find();
  },
  canAdmin: function() {
    if(Roles.userIsInRole(Meteor.userId(), "admin")) return true;
    if(Roles.userIsInRole(Meteor.userId(), this.collectionName+"-admin")) return true;
    return false;
  },
  cell: function(line, schema) {
    //var name = schema;
    var name = schema['name'];
    if(Template[schema['type']].cell) return Template[schema['type']].cell(name, line, schema);
    return line[name];
  }
});

Widgets.schemas.submissions = {
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
