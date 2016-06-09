var collections = {};

getCollection = function(name) {
  if(!Forms.findOne({collectionName:name})) {
     throw new Meteor.Error(404,name+" not found.");
  }
  if(!collections[name]) {
    var collection = new Mongo.Collection(name);
    collections[name] = collection;
  }
  return collections[name];
}

Template.registerHelper("getCollection", function() {
  return getCollection(this.collectionName);
});
