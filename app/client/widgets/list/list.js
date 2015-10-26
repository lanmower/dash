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
    if(schema[line.type] == 'approval') {
      var approvers = line['approvers'];
      var field = line['field'];
      console.log(approvers);
      console.log(field);
    }
    return line[name];
  }
});
Widgets.schemas.listWidget = {
  collectionName:{
    type: String,
    optional: false,
  }
};
