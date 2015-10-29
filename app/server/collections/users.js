DownloadAvatar = function(user) {
  if(user.services.google.picture) {
    var newFile = new FS.File();
    newFile.attachData(user.services.google.picture, function(error) {
        var file = Files.insert(newFile, function(error, fileObj) {
        file = fileObj;
        Meteor.users.update({_id:userId},{"$set":{'profile.picture':file._id}});
        console.log("Downloaded avatar", file._id);
        user.profile.picture = file._id;
      });
    });
  }
}

Accounts.validateNewUser(function (user) {
  if(user.services && user.services.google) {
    if(user.services.google.email.match(/coas\.co\.za$/)) {
        if(user.services.google.email) user.profile.email = user.services.google.email;
        DownloadAvatar(user);
        return true;
    }
    throw new Meteor.Error(403, "You must sign in using a coas.co.za account");
  }
});
Meteor.publish("me", function () {
  return Meteor.users.find({_id:this.userId}, {fields: {emails: 1, profile: 1, 'status.online':1,'services.google.accessToken': 1}});
});
Meteor.publish("users", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1, 'status.online':1}});
});
