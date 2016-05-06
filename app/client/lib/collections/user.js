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
    employmentStartDate: {
      type: String,
      autoform: {
        type: "datetimepicker"
      }
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
