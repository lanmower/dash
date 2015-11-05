Template.listWidget.created = function () {
  var template = this;
  template.destroyForm = new ReactiveVar(true);
  template.schema = new ReactiveVar(null);

  Meteor.subscribe(Template.currentData().collectionName);

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
  collectionName:{
    type: String,
    optional: false,
  }
};
