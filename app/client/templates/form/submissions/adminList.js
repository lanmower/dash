Template.submissionsAdmin.created = function () {
  var template = this;
  template.destroyForm = new ReactiveVar(true);
  template.schema = new ReactiveVar(null);

  var form = Forms.findOne({_id:Template.currentData().form});
  if(form) {
    var name = form.collectionName;
    Meteor.subscribe(name+'-admin');

    template.autorun(function () {
      template.destroyForm.set(true);
      template.schema.set(listSchema(Template.currentData().form));
    });

    template.autorun(function () {
      if (template.destroyForm.get()) {
        template.destroyForm.set(false);
      }
    });
  }
};

Template.submissionsAdmin.helpers({
  destroyForm: function() {
    return Template.instance().destroyForm.get();
  },
  getSchema: function() {
    return Template.instance().schema.get();
  },
  items: function() {
    var form = Forms.findOne({_id:this.form});
    if(form) {
      var name = form.collectionName;
      var collection = getCollection(name);
      return collection.find().fetch();
    }
  },
  cell: function(line, schema) {
    //var name = schema;
    var name = schema['name'];

    if(Template[schema['type']].cell) return Template[schema['type']].cell(name, line, schema);
    return line[name];
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
          console.log(ret);
          return ret;
        }
      }
    }
  }
};
