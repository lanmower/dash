var searchQuery = null;

Template.submissions.created = function () {
  var template = this;
  template.schema = new ReactiveVar(null);

  template.autorun(function () {
    if(Template.currentData()) {
      //Meteor.subscribe(Template.currentData().collectionName);
      template.subscribe("forms");
      template.schema.set(listSchema(Template.currentData()));
    }
  });

  template.autorun(function(){
    searchQuery = template.subscribe('formSearch', Router.current().params._id, Session.get('searchQuery'));
  });
};
Template.submissions.events({
  "submit .form": function(event) {
    return false;
  },
  'keyup .form input': _.debounce(function(event, template) {
    event.preventDefault();
    Session.set('searchQuery', template.find('.form input').value);
  }, 300)
});
Template.submissions.helpers({
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
  currentForm: function() {
    return Router.current().params.form;
  },
  items: function() {
    var name = this.collectionName;
    var collection = getCollection(name);
    return collection.find({});
  },
  searchQuery: function() {
    return Session.get("searchQuery");
  },
  canAdmin: function() {
    if(Roles.userIsInRole(Meteor.userId(), "admin")) return true;
    if(Roles.userIsInRole(Meteor.userId(), this.collectionName+"-admin")) return true;
    return false;
  },
  cell: function(line, schema) {
    var form = Router.current().params.form;
    var name = schema['name'];
    var field = Fields.findOne({parent:form, name:name});
    var allSchema = Template.instance().schema.get();
    var schemaOut = {};
    for(var x in allSchema) {
      schemaOut[allSchema[x].name] = allSchema[x];
    }
    if(Template[schema['type']]&& Template[schema['type']].cell) return Template[schema['type']].cell(name, line, schemaOut, field);
    return line[name];
  },
  label: function() {
    return this['title'];
  }
});
