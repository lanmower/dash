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
  cell: function(line, schema) {
    //var name = schema;
    console.log(schema);
    var name = schema['name'];
    if(schema[line.type] == 'approval') {
      var approvers = line['approvers'];
      var field = line['field'];
      console.log(approvers);
      console.log(field);
    }
    console.log(line, name);
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
