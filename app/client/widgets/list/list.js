Template.listWidget.created = function () {
  var template = this;
  template.destroyForm = new ReactiveVar(true);
  template.schema = new ReactiveVar(null);

  Meteor.subscribe(Template.currentData().collectionName);
  Meteor.subscribe("forms");

  template.autorun(function () {
    template.destroyForm.set(true);
    template.schema.set(listSchema(Template.currentData().form));
  });

  template.autorun(function () {
    if (template.destroyForm.get()) {
      template.destroyForm.set(false);
    }
  });
};

Template.listWidget.helpers({
  destroyForm: function() {
    return Template.instance().destroyForm.get();
  },
  getSchema: function() {
    return Template.instance().schema.get();
  },
  items: function() {
    var name = this.collectionName;
    var collection = getCollection(name);
    return collection.find();
  },
  cell: function(line, schema) {
    //var name = schema;
    var name = schema['name'];
    if(schema[line.type] == 'approval') {
      var approvers = line['approvers'];
      var field = line['field'];
    }
    if(Template[schema['type']].cell) return Template[schema['type']].cell(name, line, schema);
    return line[name];
  }
});

Widgets.schemas.listWidget = {
  form:{
    type: String,
    label: "Choose a form",
    autoform: {
      options: function() {
        if (Template.instance().subscriptionsReady()) {
          var forms = Widgets.find({"type":"formWidget"});
          var ret = [];
          forms.forEach(function(form) {
            ret.push({label:form.title, value:form._id});
          });
          console.log(ret);
          return ret;
        }
      }
    }
  }
};
