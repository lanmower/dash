_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

Meteor.publish("submission", function (form, id) {
  return Meteor.forms[form].collection.find(id,{$or: [
          {createdBy: this.userId},
          {$and:[
            {"public": true},
            {"public": {$exists: true}}
          ]}
        ]});
});

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

    ReactiveTable.publish(id+"-admin", form.collection, function () {
      var protection = {$or: [
        {createdBy: this.userId},
        {$and:[
          {"public": true},
          {"public": {$exists: true}}
        ]}
      ]}
      if(Roles.userIsInRole( this.userId, 'admin' )) return {};
      else return protection;
    });

    ReactiveTable.publish(id, form.collection, function () {
      var protection = {$or: [
        {createdBy: this.userId},
        {$and:[
          {"public": true},
          {"public": {$exists: true}}
        ]}
      ]}
      return protection;
    });

    if(!form.created) {
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

    var createHook = function(hookFunction, setFunction, form) {
      setFunction(function(userId, doc, fields) {
        var user = userId;
        _.each(form.fields.fetch(), function(formField) {
          if(hookFunction[formField.type]) hookFunction[formField.type](user, doc, form, formField, fields);
        });
        return true;
      });
    };
    form.collection.before.remove(function (userId, doc) {
      Files.find({"metadata.formId":form.formId, 'metadata.parentId':doc._id}).forEach(function(doc) {doc.remove()});
    });

    createHook(Fields.hooks.after.update, form.collection.after.update, form);
    createHook(Fields.hooks.after.insert, form.collection.after.insert, form);
    _.each(form.fields.fetch(), function(formField) {
      if(Fields.hooks.after.startup && Fields.hooks.after.startup[formField.type]) {
        Fields.hooks.after.startup[formField.type](form, formField);
      }
    });
    form.created = true;
  }

  form.collection.attachSchema(buildSchema(form));
}
}

schemaItem = function(field) {
  var ret;
  if(Fields.schemas[field.type]) ret = Fields.schemas[field.type](field);
  return ret;
}
var buildSchema = function(form) {
  console.log("Building schema", form._id);
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
  origfield = Fields.findOne({_id:id});
  if(origfield.parent) {
    var form = Meteor.forms[origfield.parent];
    if(form) form.collection.attachSchema(buildSchema(form), {replace:true});
  }
}



Meteor.startup(function () {

  Forms.find({}).observeChanges({
    added : processForm
  })
  Fields.find({}).observeChanges({
    changed : updateField,
  });


});
