Meteor.fieldTypes.push({label:"File Upload", value: "fileUpload"});

Widgets.schemas.fileUpload = function() {
  return {
    title:{
      type: String,
    }
  }
};

Fields.schemas.fileUpload = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
    type: [String],
    label: "Choose file"
  };
  output[name+'.$'] = {
    autoform: {
      "afFieldInput": {
        type: "fileUpload",
        collection: "files"
      }
    }
  };
  return output;

};
