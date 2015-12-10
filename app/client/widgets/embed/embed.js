Meteor.widgetTypes.push("embed");
Template.embed.viewmodel(function (data) {
  return {
    link:data.src
  }
});
