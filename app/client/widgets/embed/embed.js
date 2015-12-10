Meteor.widgetTypes.push({label:"Embedded page", value:"embed"});
Template.embed.viewmodel(function (data) {
  return {
    link:data.src
  }
});
