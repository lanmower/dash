Template.registerHelper("debug", function(optionalValue) {
  console.log("Current Context");
  console.log("====================");
  console.log(this);

  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
});

Template.registerHelper("pageTitle", function(title) {
  Meteor.pageTitle.set(title);
});

Template.registerHelper("arrayify", function(obj){
    result = [];
    for (var key in obj){
        result.push({name:key,value:obj[key]});
    }
    return result;
});

Template.registerHelper("file", function(_id){
    file = Files.findOne({_id:_id});
    if(file) return file.url();
});

Template.registerHelper("config", function(key){
    config = Config.findOne({key:key});
    if(config) {
      return config.value;
    }
});

Template.registerHelper("fromNow", function(dateToPass) {
  return moment(dateToPass).fromNow();
});

Meteor.collections = {};

getCollection = function(name) {
  if(!Meteor.collections[name]) {
    var collection = new Mongo.Collection(name);
    Meteor.collections[name] = collection;
  }
  return Meteor.collections[name];
}

Template.registerHelper("getCollection", function() {
  return getCollection(this.collectionName);
});


Template.registerHelper("can", function(action, impactedDocument, fieldNames) {
  if(!impactedDocument) return false;
  if(!fieldNames.isArray) fieldNames = null;
  return Meteor.can(action, impactedDocument, fieldNames);
});

Meteor.can = function(action, impactedDocument, fieldNames) {
  var allowed = false;
  if(!impactedDocument) return false;
  if(!impactedDocument.collectionType()) {
    return false;
  }
  _.each(impactedDocument.collectionType()._validators[action].allow, function(allowRule){
    if(allowRule(Meteor.userId(), impactedDocument, fieldNames)) {
      allowed = true;
    }
  });
  return allowed;
};
