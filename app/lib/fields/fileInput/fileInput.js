Widgets.schemas.fileInput = {
    title:{
      type: String,
    }
  };
Fields.schemas.fileInput = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
      type: String,
      optional:true,
      "autoform":{
        afFieldInput: {
          "type":"cfs-file",
           collection: "files"
        }
      }
  };
  //output[name+'.$'] = {
  //};
  return output;

};
