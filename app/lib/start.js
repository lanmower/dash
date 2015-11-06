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
var processField = function(id, field) {
  processForm(field.parent, Forms.find({_id:field.parent}));
}
var processForm = function(id, form) {
  if(form.collectionName) {
    if(Meteor.forms[form.collectionName]) return Meteor.forms[form.collectionName];

    var schema = Meteor.schema();
    form.collection = new Mongo.Collection(form.collectionName);
    fields = Fields.find({parent: id});
    fields.forEach(function(item) {
      if(item.name) {
        console.log("processing field:",item);
        schema[item.name] = schemaItem(item);
      }
    });
    console.log("schema:",schema);
    form.collection.attachSchema(new SimpleSchema(schema));

    Meteor.publish(form.collectionName, function (self) {
      return form.collection.find({
          createdBy: this.userId
        });
    });

    Meteor.publish(form.collectionName+"-admin", function (self) {
      var skip = true;
      if(Roles.userIsInRole(this.userId, "admin")) skip = false;
      if(Roles.userIsInRole(this.userId, form.collectionName+"-admin")) skip = false;
      if(!skip) return form.collection.find({"_id": {$exists: true}});
    });

    form.collection.allow({
      insert: function (userId, doc) {
        return true;
      },

      update: function (userId, doc, fieldNames, modifier) {
        return true;
      },

      remove: function (userId, doc) {
        return true;
      }
    });
    Meteor.forms[form.collectionName] = form;
  }
}

Meteor.startup(function () {
  if(Meteor.isClient){
    Hooks.init();
  }
  var ready = function() {
    if(Meteor.isServer) {
      var forms = Forms.find({
        collectionName:{$exists:true}
      }).observeChanges({
        added: processForm
      });

      var fields = Fields.find({parent:{$exists:true}}).observeChanges({
          added: processField,
          changed: processField,
          removed: processField
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
