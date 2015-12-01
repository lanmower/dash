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
    form._id = id;
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
        setFunction(function(userId, doc, fields) {
          _.each(fields, function(field) {
            _.each(form.fields.fetch(), function(item) {
              if(hookFunction[item.type]) hookFunction[item.type](userId, doc, form, item, fields);
            });
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

Meteor.methods({
  'lib\notify': function (_id) {

    if (this.isSimulation) {
    //   // do some client stuff while waiting for
    //   // result from server.
    //   return;
  } else
    Meteor.forms[_id].collection.find().forEach(function(doc) {
        var user = notifyRequired(doc, Meteor.forms[_id]);
      });

  }
});


var notifyRequired = function(doc, form) {
  var min = 0;
  var user = Meteor.users.findOne({_id:doc.createdBy});
  var formFields = form.fields.fetch();
  _.each(form.fields, function(field) {
    if(!field.optional && !doc[field]) ++min;
    //form.collection.update(doc._id, { $push: {'notifiedFields': field._id}});
  });
  if(min) {
    console.log('required, sending notification');
    fields = {'name' : user.profile.name, 'email' : user.profile.email, 'doc' : doc, 'date' : Date(), 'href' : Meteor.absoluteUrl()+'form/update/'+form._id+'/'+doc._id};
    Email.send({
      to: user.profile.email,
      from: 'admin@coas.co.za',
      subject: _.template("A form you've submitted requires additional information.")(fields),
      text: _.template("A form you've submitted requires additional information, please visit {{href}} to revise your submission.")(fields),
      html:_.template("<h1>A form you've submitted requires additional information</h1>. please click <a href='{{href}}'>here</a> to revise your submission.")(fields)
    });
    return doc.createdBy;
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
