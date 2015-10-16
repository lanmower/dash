if(Meteor.isServer) {
  Hooks.onLoggedOut = function (userId) {
    var user = Meteor.users.findOne({_id:userId});
    var lat = user.profile.lat;
    var lng = user.profile.lng;
    Events.insert({event:"logout",userId:userId,time:new Date(), lat:lat, lng:lng});
  }
}
