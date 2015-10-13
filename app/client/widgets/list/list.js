Template.listWidget.created = function () {
  var self = this;
  self.autorun(function () {
    Meteor.subscribe(Template.currentData().collectionName);
  });
};

var items = function(name) {
  if(!Meteor.collections[name]) {
    var collection = new Mongo.Collection(name);
    Meteor.collections[name] = collection;
  }
  return Meteor.collections[name].find();
}

Template.listWidget.helpers({
  items: function() {
    return items(this.collectionName);
  },
  schema: function() {
    return this.schema;
  },
  cell: function(line, name) {
    return line[name];
  }
});
Widgets.schemas.listWidget = {
  collectionName:{
    type: String,
    optional: false,
  },
  'schema.$.name': {
      type: String,
      label: "Name",
      max: 200
  },
  'schema.$.type' :{
      type: String,
      label: "Type",
      max: 200
  },
  'schema.$.label': {
      type: String,
      label: "Label",
      max: 200
  }
};
