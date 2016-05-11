Meteor.widgetTypes.push({label:"User Code", value:"userCode"});
Template.userCode.helpers({
  code: function() {
    Math.seedrandom(Meteor.userId());
    return ""+parseInt(Math.random()*10)+parseInt(Math.random()*10)+parseInt(Math.random()*10)+parseInt(Math.random()*10);
  },
});
