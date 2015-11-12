Widgets.schemas.fileInput = {
    title:{
      type: String,
    }
  };
Fields.schemas.fileInput = function(data) {
      return {
        "type":String,
        optional:true,
        "autoform":{
          afFieldInput: {

            type: "cfs-file",
            collection: "files"
          }
        }
      }
  };
