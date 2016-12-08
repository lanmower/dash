Meteor.widgetTypes.push({label:"Announcement", value:"announcement"});
Widgets.schemas.announcement = function() {
  return {
    listposition:{
          type: String,
    },
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
