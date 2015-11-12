Widgets.schemas.announcement = {
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
  },
};
