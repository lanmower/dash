Widgets.schemas.fileInput = function() {
  return {
    title:{
      type: String,
    }
  }
};
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
