Meteor.widgetTypes.push({label:"Embedded page", value:"embed"});
Widgets.schemas.embed = function() {
  return {
    link:{
      type: String,
      optional: false,
    }
  }
};
