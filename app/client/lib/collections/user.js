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
    profile: {
        type: schema.UserProfile,
        optional: true
    },
    roles: {
        type: [String],
        optional: true
    }
});

schema.Role = new SimpleSchema({
  name: {
    type: String
  }
});

Meteor.users.attachSchema(schema.User);
Meteor.roles.attachSchema(schema.Role);
