if(Meteor.isClient){
  Hooks.init();
}

    var endsWith = function(source, suffix) {
        return source.indexOf(suffix, source.length - suffix.length) !== -1;
    };
DownloadAvatar = function(userId) {
  var user=Meteor.users.findOne(userId);
  if(!user) return;
  if(user.profile.picture) {
    var file = Files.findOne(user.profile.picture);
    if(file) Files.remove(user.profile.picture);
  }
  if(user.services && user.services.google && user.services.google.picture) {
    var newFile = new FS.File();
    if(user.profile) {
      newFile.attachData(user.services.google.picture, function(error) {
        if(error) {
          console.log(error);
        }
        else {
          var file = Files.insert(newFile, function(error, fileObj) {
            if(error) console.log(error);
            else {
              file = fileObj;
              Meteor.users.update({_id:user._id },{"$set":{'profile.picture':file._id}});
              user.profile.picture = file._id;
            }
          });
        }
      });
    }
  }
};
Accounts.onCreateUser(function(options, user) {
  var email = null;
  if(user.services && user.services.google && user.services.google.email) {
    email = user.services.google.email;
    DownloadAvatar(user);
  }
  if(Meteor.users.find().count() === 0){
     user.roles = ["admin"]
  }
  user.profile = {name:options.profile.name, email:email};//
  return user;
});

Accounts.validateNewUser(function (user) {
    config = Meteor.settings.emailDomains;
    var pass = false;
    if(config && config.length) {
      config.forEach(function(item) {
        if(user.services.google) {
          if( endsWith(user.services.google.email,item)) {
              pass = true;
          }
        }
        if(user.emails) {
            _.each(user.emails, function(email) {
               if(endsWith(email.address,item)) pass = true;
            });
        }
      });
      if(pass)return true;
      throw new Meteor.Error(403, "You must sign up with an authorized account");
    } else {
      return true;
    }
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
  roles: {
      type: String,
      optional: true
  },
  titles: {
      type: String,
      optional: true
  },
  phone: {
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
    signature: {
        type: String,
        autoform: {
          afFieldInput: {
            type: 'summernote',
          }
        },
        optional: true
    },
    country: {
        type: schema.UserCountry,
        optional: true
    },
    code: {
        type: Number,
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
