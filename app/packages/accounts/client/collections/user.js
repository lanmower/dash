var schema = {};

schema.UserCountry = new SimpleSchema({
    name: {
        type: String,
        optional: true
    },
    code: {
        type: String,
        regEx: /^[A-Z]{2}$/,
        optional: true
    }
});

Fields.schemas.userSelectInput = function(data) {
    var name = data.name
    var users = Meteor.usersList()
    var allowed = [];
    _.each(users, function(user) {
        allowed.push(user.value);
    });
    var output = {};
    output[name] = {
        type: String,
        optional: true,
        label: data.title,
        allowedValues: allowed,
        autoform: {
            //type: "universe-select",
            afFieldInput: {
                multiple: true,
                options: function() {
                    return Meteor.usersList();
                }
            }
        }
    };
    return output;
};


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
    organization: {
        type: String,
        optional: true
    },
    website: {
        type: String,
        regEx: SimpleSchema.RegEx.Url,
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
