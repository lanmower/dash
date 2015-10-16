DownloadAvatar = function(userId) {
  var file = null;
  var newFile = new FS.File();
  var user = Meteor.users.findOne({_id:userId});
  newFile.attachData(user.services.google.picture, function(error) {
    file = Files.insert(newFile, function(error, fileObj) {
      file = fileObj;
      Meteor.users.update({_id:userId},{"$set":{'profile.picture':file._id}});
      console.log("Downloaded avatar", file._id);
    });
  });
}

Accounts.validateNewUser(function (user) {
    if(user.services.google.email.match(/coas\.co\.za$/)) {
        user.profile.picture = file._id;
        user.profile.email = user.services.google.email;
        DownloadAvatar(user._id);
        return true;
    }
    throw new Meteor.Error(403, "You must sign in using a coas.co.za account");
});
Meteor.publish("me", function () {
  return Meteor.users.find({_id:this.userId}, {fields: {emails: 1, profile: 1, 'status.online':1,'services.google.accessToken': 1}});
});
Meteor.publish("users", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1, 'status.online':1}});
});
