Hooks.onLoggedIn = function (userId) {
  console.log("log in hook");
  //if(Meteor.user().profile && (!Meteor.user().profile.picture ||
  //    Meteor.user().profile.picture.length != 17 ||
  //    !Files.findOne({_id:Meteor.user().profile.picture}))) {
  //  console.log("Downloading avatar for:",Meteor.userId());
  //};
  SetEmail(Meteor.user());
  if(Meteor.user().services && Meteor.user().services.google && Meteor.user().services.google.name && Meteor.user().profile.name != Meteor.user().services.google.name) {
    Meteor.users.update({_id:userId },{"$set":{'profile.name': Meteor.user().services.google.name}});
  } else if(Meteor.user().services && Meteor.user().services.facebook && Meteor.user().services.facebook.name) {
      Meteor.users.update({_id:userId },{"$set":{'profile.name': Meteor.user().services.facebook.name}});
  } else if(!Meteor.user().profile || !Meteor.user().profile.name) {
    Meteor.users.update({_id:userId },{"$set":{'profile.name': ''}});
  }



  Events.insert({event:"login",userId:Meteor.userId(),time:new Date()});
}
