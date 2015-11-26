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
var processForm = function(id, formData) {
  var form = Meteor.forms[id]?Meteor.forms[id]:{};
  if(formData.collectionName) {
    console.log("Processing form:"+id);
    if(!form.collection) form.collection = new Mongo.Collection(formData.collectionName);
    if(!form.fields) form.fields = Fields.find({parent: id});
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
      form.collection.after.update(function(userId, doc) {
        user = Meteor.users.findOne({_id:doc.createdBy});
        form.fields.forEach(function(item) {

          if(item.type == "approveNotification") {
            var min = 0;
            form.fields.forEach(function(field) {
              if(field.type == "approveInput") {
                if(doc[field.name] == 'Approved') ++min;
              }
            });
            if(min == item.min) {
              console.log('approved, sending notification');
              fields = {'name' : user.profile.name, 'email' : user.profile.email, 'doc' : doc, 'date' : Date(), 'href' : Meteor.absoluteUrl()+'form/update/'+id+'/'+doc._id};
              var opts = {
                to: user.profile.email,
                from: 'admin@coas.co.za',
                subject: _.template(item.mailSubject)(fields),
                text: _.template(item.mailMessage)(fields),
                html:_.template(item.mailMessageHtml)(fields)
              };
              console.log(opts);
              Email.send(opts);
            }
          }
        });
      });
    }
    var schemaBuild = Meteor.schema();
    form.fields.forEach(function(item) {
      if(item.name) {
        var si = schemaItem(item);
        _.each(si, function(value, key, obj) {
          schemaBuild[key] = value;
        });
        //schemaBuild[item.name] = si;
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
