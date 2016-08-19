Meteor.widgetTypes.push({label:"WYSiWYG", value:"wwWidget"});
Widgets.schemas.wwWidget = function() {
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
