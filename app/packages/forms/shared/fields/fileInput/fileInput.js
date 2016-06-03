Meteor.fieldTypes.push({label:"File Input", value: "fileInput"});
Meteor.fieldTypes.push({label:"File list", value: "fileList"});

Widgets.schemas.fileInput = function() {
  return {
    title:{
      type: String,
    }
  }
};

Meteor.startup(function () {
  if(Meteor.isClient) {
    AutoForm.addInputType("fileList", {
      template: "afFileList",
    });
  }
});

Fields.schemas.fileInput = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
    type: [String],
    optional: true,
    autoform: {
      type: "cfs-files",
      collection: "files"
    }
  };
  //output[name+'.$'] = {
  //};
  return output;

};
