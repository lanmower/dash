Widgets.schemas.announcement = {
  header:{
    type: String,
    optional: false,
  },
  body:{
    type: String,
    afFieldInput: {
      type: 'summernote',
    },
    optional: false,
  },
};
