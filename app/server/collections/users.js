DownloadAvatar = function(user) {
  if(user.services.google.picture) {
    var newFile = new FS.File();
    newFile.attachData(user.services.google.picture, function(error) {
        var file = Files.insert(newFile, function(error, fileObj) {
        file = fileObj;
        Meteor.users.update({_id:user._id },{"$set":{'profile.picture':file._id}});
        user.profile.picture = file._id;
      });
    });
  }
}

Accounts.onCreateUser(function(options, user) {
  if(user.services.google.email) {
    Meteor.users.update({"_id":user.id}, {"$set":{"profile.email": user.services.google.email}});
    DownloadAvatar(user);
  }
  if(Meteor.users.find().count() === 0){
     user.roles = ["admin"]
  }
  return user;
});

Accounts.validateNewUser(function (user) {
    if(user.services.google.email.match(/coas\.co\.za$/)) {
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

Meteor.publish("user", function (id) {
  return Meteor.users.find({_id:id}, {fields: {emails: 1, profile: 1, 'status.online':1, roles:1}});
});

var schema = {};

schema.UserCountry = new SimpleSchema({
    name: {
        type: String
    },
    code: {
        type: String,
        regEx: /^[A-Z]{2}$/
    }
});

schema.UserProfile = new SimpleSchema({
    name: {
        type: String,
        optional: true
    },
    firstName: {
        type: String,
        optional: true
    },
    lastName: {
        type: String,
        optional: true
    },
    birthday: {
        type: Date,
        optional: true
    },
    gender: {
        type: String,
        allowedValues: ['Male', 'Female'],
        optional: true
    },
    picture: {
        type: String,
        optional: true
    },
    organization : {
        type: String,
        optional: true
    },
    website: {
        type: String,
        regEx: SimpleSchema.RegEx.Url,
        optional: true
    },
    bio: {
        type: String,
        optional: true
    },
    country: {
        type: schema.UserCountry,
        optional: true
    }
});

schema.User = new SimpleSchema({
    username: {
        type: String,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    emails: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: schema.UserProfile,
        optional: true
    },
    // Make sure this services field is in your schema if you're using any of the accounts packages
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    status: {
        type: Object,
        optional: true,
        blackbox: true
    },
    roles: {
        type: Array,
        optional: true
    },
    "roles.$": {
        type: String,
        optional: true
    }
});
//Meteor.users.attachSchema(schema.User);
