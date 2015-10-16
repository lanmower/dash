if(Meteor.isClient) Meteor.widgetJs = {};
Meteor.forms = {}

var formUpdate = function(data, form) {
  if(form.schema && form.collectionName) {
    if(Meteor.forms[form.collectionName]) return Meteor.forms[form.CollectionName];
    var schema = Meteor.schema();
    form.collection = new Mongo.Collection(form.collectionName);
    for(var x in form.schema) {
      var item = form.schema[x];
      schema[item.name] = schemaItem(item);
    }
    console.log(schema);
    form.collection.attachSchema(new SimpleSchema(schema));

    Meteor.publish(form.collectionName, function (self) {
      return form.collection.find(function(self) {
        return {createdBy: self.userId};
      });
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
var update = function(data, type) {
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
  var ready = function() {
    if(Meteor.isServer) {
      var forms = Widgets.find({
        schema:{$exists:true},
        collectionName:{$exists:true}
      }).observeChanges({
        //changed: formUpdate,
        added: formUpdate
      });
    }
    var types = Types.find().observeChanges({
      changed: update,
      added: update
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
