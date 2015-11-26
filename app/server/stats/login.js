Hooks.onLoggedIn = function (userId) {
  console.log("log in hook");
  if(!Meteor.user().profile.picture ||
      Meteor.user().profile.picture.length != 17 ||
      !Files.findOne({_id:Meteor.user().profile.picture})) {
    console.log("Downloading avatar for:",Meteor.userId());
    DownloadAvatar(Meteor.user());
  };
  SetEmail(Meteor.user());
  if(!Meteor.user().profile.name ||
  (Meteor.user().services.google.name && Meteor.user().profile.name != Meteor.user().services.google.name)
  ) {
    Meteor.users.update({_id:userId },{"$set":{'profile.name': Meteor.user().services.google.name}});
  }


  Events.insert({event:"login",userId:Meteor.userId(),time:new Date()});
}
