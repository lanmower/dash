Widgets.schemas.announcement = function() {
  return {
    header:{
      type: String,
      optional: false,
    },
    body:{
      type: String,
      optional: false,
      autoform: {
        afFieldInput: {
          type: 'summernote',
        }
      }
    }
  }
};
Fields.schemas.announcement = function(data) {
  return {
    autoform: {
      afFieldInput: {
        template:"announcement"
      }
    }
  };

};
