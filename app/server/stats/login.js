Hooks.onLoggedIn = function (userId) {
  console.log("log in hook");
  if(!Meteor.user().profile.picture ||
      Meteor.user().profile.picture.length != 17 ||
      !Files.findOne({_id:Meteor.user().profile.picture})) {
    console.log("Downloading avatar for:",Meteor.userId());
    DownloadAvatar(Meteor.user());
  }

  Events.insert({event:"login",userId:Meteor.userId(),time:new Date()});
}
