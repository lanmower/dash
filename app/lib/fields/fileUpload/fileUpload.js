Meteor.fieldTypes.push({label:"File Upload", value: "fileUpload"});

Widgets.schemas.fileUpload = function() {
  return {
    title:{
      type: String,
    }
  }
};
var getTitle = function(file) {
  if(file.metadata.id3 && file.metadata.id3.title) return file.metadata.id3.title;
  if(file.metadata.filename) return file.metadata.filename;
  return file.original.name;
}

if(Meteor.isClient) {

  Template.afFileUpload.onCreated(function () {

    Meteor.subscribe('formFiles', Router.current().params.form, Router.current().params._id);
  });

  var getFind = function(name, type) {
    if(!Router.current().data() || !Router.current().data().form) return;
    return Files.find ({
      'metadata.field': name,
      'metadata.parentId': Router.current().params._id,
      'metadata.collectionName': Router.current().data().form.collectionName,
      'metadata.type': type
    });
  };

  Template.afFileUpload.helpers({
    image: function() {
      return getFind(this.name,'image');
    },
    imageCount: function() {
      return getFind(this.name,'image').count();
    },
    video: function() {
      return getFind(this.name,'video');
    },
    videoCount: function() {
      return getFind(this.name,'video').count();
    },
    audio: function() {
      return getFind(this.name,'audio');
    },
    audioCount: function() {
      return getFind(this.name,'audio').count();
    },
    title: function() {
      return getTitle(this);
    },
    isUpdate: function() {
      return AutoForm.getCurrentDataForForm().type == 'update';
    }
  });

  Template.afFileUploadImage.onRendered(function() {
    var self = this;
    Template.afFileUploadImages.helpers({
      files : function() {
        if(self.slicked) {
          $(self.find(".slick")).slick("unslick");
        } else self.slicked = true;
        var slick = $(self.find(".slick")).slick({
          dots: true,
          infinite: true,
          speed: 300,
          slidesToShow: 3,
          variableWidth: true
        });
        return Files.find(this.images);
      }
    }
    );
});

  Template.afFileUpload.events({
    'click .playTrack': function(event, template) {
      var pl = playlist.get();
      pl.push({type:"audio/mp3",title:getTitle(this),src:this.url('media')});
      playlist.set(pl);
    },
    'click .playVideo': function(event, template) {
      var pl = playlist.get();
      pl.push({type:"video/mp4",title:getTitle(this),src:this.url('media')});
      playlist.set(pl);
    },
    'change .fileInput': function(event, template) {
      targetField = template.data.name; //Template.parentData(4).fields[Template.parentData(4).fields.indexOf(Template.parentData(4).name)+1]
      doc = Router.current().data().item;
      $("#uploadsNotificationsTrigger").click();
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
          if(fileObj) {
          }
          // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        });
      });
    }
  });

  Meteor.startup(function () {
    AutoForm.addInputType("fileUploadHtml", {
      template: "afFileUpload",
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
          type: 'hidden',
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
