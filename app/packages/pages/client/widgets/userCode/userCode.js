Meteor.widgetTypes.push({label:"User Code", value:"userCode"});
Template.userCode.helpers({
  code: function() {
    Math.seedrandom(Meteor.userId());
    Meteor.users.update({_id:Meteor.userId()}, {$set:{code:parseInt(""+parseInt(Math.random()*10)+parseInt(Math.random()*10)+parseInt(Math.random()*10)+parseInt(Math.random()*10))}});
    return ""+parseInt(Math.random()*10)+parseInt(Math.random()*10)+parseInt(Math.random()*10)+parseInt(Math.random()*10);
  },
});
