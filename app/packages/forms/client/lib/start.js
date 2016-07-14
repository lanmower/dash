if(Meteor.isClient){
  Meteor.startup(function () {
    Router.onBeforeAction("loading");
  });
  this.subscribe("types", {});
}
