Widgets.schemas.fileInput = {
    title:{
      type: String,
      optional: false,
    }
  };
Fields.schemas.fileInput = function(data) {
      return {
        "type":String,
        "autoform":{
          afFieldInput: {
            type: "cfs-file",
            collection: "files"
          }
        }
      }
  };
