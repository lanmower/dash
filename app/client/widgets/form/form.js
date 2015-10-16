Widgets.formSchema = function(data) {
  var tschema = {};
  for(var x in data) {
    var orig = data[x];
    var name = orig.name;
    var type = orig.type;
    //delete schemaItem["name"];
    //delete schemaItem["type"];
    var schemaItem = {};
    if(type == "Date") {
      schemaItem["type"] = Date,
      schemaItem["autoform"] = {
        afFieldInput: {
          type: "bootstrap-datetimepicker",
          value: new Date()
        }
      }
    }
    if(type == "String") schemaItem["type"] = String;
    if(type == "File") {
      schemaItem["type"] = String;
      schemaItem["autoform"] = {
        afFieldInput: {
          type: "cfs-file",
          collection: "files"
        }
      }
    }
    tschema[name] = schemaItem;
  }
  Meteor.subscribe("files");
  //_.extend(tschema, Widgets.schema);
  return  new SimpleSchema(tschema);
}

Template.formWidget.created = function () {
  var template = this;
  var destroyForm = new ReactiveVar(true);
  var schema = new ReactiveVar(null);

  Template.formWidget.helpers({
    destroyForm: function() {
      return destroyForm.get();
    },
    getSchema: function() {
      return schema.get();
    },
  });


  template.autorun(function () {
    destroyForm.set(true);
    var tschema = Widgets.formSchema(Template.currentData().schema);
    schema.set(tschema);
  });

  template.autorun(function () {
    if (destroyForm.get()) {
      destroyForm.set(false);
    }
  });
};

Widgets.schemas.formWidget = {
  'schema.$': {
        type: [Object],
        label: "Form fields",
        optional: true
  },
  'schema.$.name': {
      type: String,
      label: "Name",
      max: 200
  },
  'schema.$.type' :{
      type: String,
      label: "Type",
      max: 200
  },
  'schema.$.label': {
      type: String,
      label: "Label",
      max: 200
  }
};
