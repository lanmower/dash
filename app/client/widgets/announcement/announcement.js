Meteor.widgetTypes.push("announcement");
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
