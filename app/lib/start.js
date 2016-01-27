var started;
if(Meteor.isClient) Meteor.widgetJs = {};
Meteor.forms = {}
_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

if(Meteor.isServer)  {
  Meteor.publish("formFiles", function (form, id) {
    var form = Meteor.forms[form];
    fields = [];
    Fields.find({parent: form._id,type:"fileUpload"}).forEach(function (field) {
      fields.push(field.name);
    });
    return Files.find({"metadata.parentId":id, "metadata.collectionName":form.collectionName,"metadata.field":{$in:fields}});
  });
  Meteor.publish("submission", function (form, id) {
    return Meteor.forms[form].collection.find(id);
  });
}

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
    form.collectionName = formData.collectionName;
    if(!form.created) {
      Meteor.publish(formData.collectionName, function (self) {
          return form.collection.find({$or: [
            {createdBy: this.userId},
            {$and:[
              {"public": true},
              {"public": {$exists: true}}
            ]}
          ]});
        }
      );
      Meteor.publish(formData.collectionName+"-admin", function (self) {
          var skip = true;
          if(Roles.userIsInRole(this.userId, "admin")) skip = false;
          if(Roles.userIsInRole(this.userId, formData.collectionName+"-admin")) skip = false;
          if(!skip) return form.collection.find({"_id": {$exists: true}});
      });
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
      var createHook = function(hookFunction, setFunction, form) {
        setFunction(function(userId, doc, fields) {
          _.each(form.fields.fetch(), function(formField) {
            if(fields && fields.indexOf(formField.name))
            if(hookFunction[formField.type])
            hookFunction[formField.type](userId, doc, form, formField, fields);
          });
          return true;
        });
      };
      form.collection.before.remove(function (userId, doc) {
        Files.find({"metadata.collectionName":form.collectionName, 'metadata.parentId':doc._id}).forEach(function(doc) {doc.remove()});
      });
      createHook(Fields.hooks.after.update, form.collection.after.update, form);
      createHook(Fields.hooks.after.insert, form.collection.after.insert, form);
    }

    form.collection.attachSchema(buildSchema(form));
  }
}

var buildSchema = function(form) {
  console.log("Building schema");
  var schema = Meteor.schema();
  form.fields.forEach(function(item) {
    if(item.name) {
      var si = schemaItem(item);
      _.each(si, function(value, key, obj) {
        schema[key] = value;
      });
    }
  });
  return new SimpleSchema(schema);
}

Meteor.methods({
  'lib\notify': function (_id) {

    if (this.isSimulation) {
      //   // do some client stuff while waiting for
      //   // result from server.
      //   return;
    } else {
      Meteor.forms[_id].collection.find().forEach(function(doc) {
        var user = notifyRequired(doc, Meteor.forms[_id]);
      });

    }
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
    fields = {'name' : user.profile.name, 'email' : user.profile.email, 'doc' : doc, 'date' : Date(), 'href' :Meteor.absoluteUrl()+'form/update/'+form._id+'/'+doc._id};
    if(user.profile.email) Email.send({
      to: user.profile.email,
      from: 'admin@coas.co.za',
      subject: _.template("A form you've submitted requires additional information.")(fields),
      text: _.template("A form you've submitted requires additional information, please visit {{href}} to revise your submission.")(fields),
      html:_.template("<h1>A form you've submitted requires additional information</h1>. please click <a href='{{href}}'>here</a> to revise your submission.")(fields)
    });
    return doc.createdBy;
  }
}

var updateField = function(id, field) {
  form = null;
  if(field.parent) form = Meteor.forms[field.parent];
  if(form) form.collection.attachSchema(buildSchema(form), {replace:true});
}

Meteor.startup(function () {
  if(Meteor.isClient){
    Meteor.subscribe("types", {});
    Hooks.init();
  }
  if(Meteor.isServer) {
    //Forms.find({}).forEach(function(item) {
      //processForm(item._id, item);
    //});
    Forms.find({}).observeChanges({
      added : processForm
    })
    Fields.find({}).observeChanges({
      changed : updateField,
      added : updateField
    });
    SearchSource.defineSource('forms', function(id, searchText, options) {
      var options = {sort: {isoScore: -1}, limit: 20};

      if(searchText) {
        var regExp = buildRegExp(searchText);
        var selector = {packageName: regExp, description: regExp};
        return Meteor.forms[id].find(selector, options).fetch();
      } else {
        return Meteor.forms[id].find({}, options).fetch();
      }
    });

    started = true;
  }

});
