Meteor.widgetTypes.push({label:"HTML Content", value:"htmlWidget"});
Widgets.schemas.htmlWidget = function() {
  return {
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
