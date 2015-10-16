Hooks.onLoggedIn = function (userId) {
  if(Meteor.isClient && Meteor.user()) {
    var coords = Geolocation.latLng();
    if(userGeoLocation.get()) {
      console.log('updating coords');
      Meteor.users.update({_id:Meteor.userId()},{"$set":{'profile.lat':userGeoLocation.get().lat, 'profile.lng':userGeoLocation.get().lng}});
    }
  }
  if(Meteor.isServer) {
    if(Meteor.user().profile.picture.length != 17) {
      console.log(Meteor.userId());
      DownloadAvatar(Meteor.userId());
    }
    var lat = Meteor.user().profile.lat;
    var lng = Meteor.user().profile.lng;
    Events.insert({event:"login",userId:Meteor.userId(),time:new Date(), lat:lat, lng:lng});
  }
}
