if(Meteor.isClient) Meteor.widgetJs = {};
Meteor.forms = {}

var processType = function(data, type) {
  if(type.js) {
    console.log("calling js:", type.js);
    eval(type.js);
  }
  if(type.serverjs && Meteor.isServer) {
    console.log("calling server js:", type.serverjs);
    if(type.serverjs) eval(type.serverjs);
  }
  if(Meteor.isClient) {
    if(type.template) {
      console.log("pushing template:", type.template);
      LiveUpdate.pushHtml(type.template);
    }
    if(type.clientjs) {
      console.log("pushing client js:", type.clientjs);
      LiveUpdate.pushJs(type.clientjs, Meteor.widgetJs[type.value] || "");
      Meteor.widgetJs[type.value] = type.clientjs;
    }
  }
};

Meteor.startup(function () {
  if(Meteor.isClient){
    Hooks.init();
  }
  var ready = function() {
    if(Meteor.isServer) {
      var forms = Widgets.find({
        collectionName:{$exists:true}
      }).observeChanges({
        added: processForm
      });
    }
    var types = Types.find().observeChanges({
      changed: processType,
      added: processType
    });
  }
  if(Meteor.isClient) {
    Meteor.subscribe("types", {
      onReady: ready,
      onError: function () { console.log("onError", Types.find().fetch()); }
    });
  }
  if(Meteor.isServer) {
    ready();
  }
});
