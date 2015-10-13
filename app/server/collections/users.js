Accounts.validateNewUser(function (user) {
    if(user.services.google.email.match(/coas\.co\.za$/)) {
        user.profile.picture = user.services.google.picture;
        user.profile.email = user.services.google.email;
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
