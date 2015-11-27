Widgets.schemas.fileInput = {
    title:{
      type: String,
    }
  };
Fields.schemas.fileInput = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
    type: [String],
    autoform: {
      type: "cfs-files",
      collection: "files"
    }
  };
  //output[name+'.$'] = {
  //};
  return output;

};
