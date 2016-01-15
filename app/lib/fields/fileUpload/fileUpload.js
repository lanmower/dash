Meteor.fieldTypes.push({label:"File Upload", value: "fileUpload"});

Widgets.schemas.fileUpload = function() {
  return {
    title:{
      type: String,
    }
  }
};

if(Meteor.isClient) {
  Template.afFileUpload.helpers({
    audio: function() {
      var uploads = null;
      if(Router.current().data().item) uploads = Router.current().data().item[this.name];
      if(!uploads) return false;
      return Files.find({
        '_id': {
          $in: uploads,
        },
        'metadata.type': 'audio'
      });
    }
  });

  Meteor.startup(function () {
    AutoForm.addInputType("fileUploadHtml", {
      template: "afFileUpload",
    });

    Template.afFileUpload.events({
      'change .fileInput': function(event, template) {
        targetField = template.data.name; //Template.parentData(4).fields[Template.parentData(4).fields.indexOf(Template.parentData(4).name)+1]
        doc = Router.current().data().item;
        FS.Utility.eachFile(event, function(file) {
          var newFile = new FS.File(file);
          newFile.metadata = {
            owner : Meteor.userId(),
            collectionName : Router.current().data().form.collectionName,
            parentId : doc._id,
            field : targetField
          };
          Files.insert(newFile, function (err, fileObj) {
            if(err) console.log("error", err);
            if(fileObj) console.log("insertion of", fileObj);
            // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
          });
        });
      }
    });
  });
}
/*
var after = function(userId, doc, form, item) {
  var user = Meteor.users.findOne({_id:doc.createdBy});
  var formFields = form.fields.fetch();
}
Fields.hooks.after.update.fileUpload = after;
Fields.hooks.after.insert.fileUpload = after;
*/

Fields.schemas.fileUpload = function(data) {
  var name = data.name
  var output = {};
  output[name+'-file'] = {
        type: String,
        label: "",
        optional: true,
        autoform: {
          label: "",
          type: 'hidden',
          /*afFieldInput: {
            label: "",
            type: 'fileUploadHtml',
          }*/
        }
    };
  output[name] = {
        type: [String],
        label: "",
        optional: true,
        autoform: {
          //afFieldInput: {
            type: 'hidden',
          //}
          afFieldInput: {
            label: "",
            type: 'fileUploadHtml',
          }
        }
    };
  return output;
};


Widgets.schemas.fileUpload = function() {
  return {
    name:{
      type: String,
      optional: true,
      //autoform: {
      //  type: "hidden"
      //}
    }
  }
};
