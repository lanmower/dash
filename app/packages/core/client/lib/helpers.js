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

_.extend(Blaze.View.prototype,{
  closest: function(searchedViewName){
    currentView = this;
    while (currentView && currentView.name != searchedViewName){
      currentView = currentView.parentView;
    }
    return currentView;
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
    var file = Files.findOne({_id:_id});
    if(file) return file.url();
});

Template.registerHelper("setting", function(key){
    var config = Meteor.settings.public[key];
    if(config) {
      //console.log("Loaded setting:"+config);
      return config;
    }
});

Template.registerHelper("fromNow", function(dateToPass) {
  return moment(dateToPass).fromNow();
});

Template.registerHelper("can", function(action, impactedDocument, fieldNames) {
  if(!impactedDocument) return false;
  if(!fieldNames.isArray) fieldNames = null;
  return gong.can(Meteor.userId(), impactedDocument, action, fieldNames);
});
