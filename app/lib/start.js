if(Meteor.isClient) Meteor.widgetJs = {};
Meteor.forms = {}
_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

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

processForm = function(id, formData) {
  var form;
  if(Meteor.forms[id]) form = Meteor.forms[id];
  else {
    form = {};
    Meteor.forms[id] = form;
  }
  if(formData.collectionName) {
    console.log("Processing form:"+id);
    if(!form.collection) form.collection = new Mongo.Collection(formData.collectionName);
    form.fields = Fields.find({parent: id});
    if(!form.created) {
      Meteor.publish(formData.collectionName, function (self) {
        return form.collection.find({
          createdBy: this.userId
        });
      });
      Meteor.publish(formData.collectionName+"-admin", function (self) {
        var skip = true;
        if(Roles.userIsInRole(this.userId, "admin")) skip = false;
        if(Roles.userIsInRole(this.userId, formData.collectionName+"-admin")) skip = false;
        if(!skip) return form.collection.find({"_id": {$exists: true}});
      });
      console.log("Setting allow");
      form.collection.allow({
        insert: function (userId, submission) {
          console.log("insert allowed");
          return true;
        },
        update: function (userId, submission, fields, modifier) {
          var allowed = 1;
          Fields.find({parent: id,type:"approveInput"}).forEach(function (field) {
            console.log(field.user, userId);
            if(field.user != userId) fail = 1;
          });
          return allowed;
        },
        remove: function (userId, submission) {
          console.log("delete allowed");
          return true;
        }
      });
      form.created = true;
      console.log('adding approval notify hook');
      var createHook = function(hookFunction, setFunction, form) {
        setFunction(function(userId, doc) {

          _.each(form.fields.fetch(), function(item) {
            if(!hookFunction[item.type]) return;
            hookFunction[item.type](userId, doc, form, item);
          });
          return true;
        });
      };
      createHook(Fields.hooks.after.update, form.collection.after.update, form);
      createHook(Fields.hooks.after.insert, form.collection.after.insert, form);
    }
    console.log("Building schema");
    var schemaBuild = Meteor.schema();
    form.fields.forEach(function(item) {
      if(item.name) {
        var si = schemaItem(item);
        _.each(si, function(value, key, obj) {
          schemaBuild[key] = value;
        });
      }
    });
    form.collection.attachSchema(new SimpleSchema(schemaBuild));
  }
}

var processField = function(id, field) {
  if(field.parent) processForm(field.parent._id, Forms.find({_id:field.parent}));
}

Meteor.startup(function () {
  if(Meteor.isClient){
    Meteor.subscribe("types", {});
    Hooks.init();
  }
  if(Meteor.isServer) {
    Forms.find({}).observeChanges({
      changed : processForm,
      added : processForm
    })
    Fields.find({}).observeChanges({
      changed : processField,
      added : processField
    });
  }
  Types.find().observeChanges({
    changed: processType,
    added: processType
  });
});
