Meteor.fieldTypes.push({label:"Approve Input", value:"approveInput"});

Meteor.userList = function() {
  var ret = [];
  var users = Meteor.users.find().fetch();
  for(var x in users) {
    ret.push({label:users[x].profile.name, value:users[x]._id});
  }
  return ret;
}
var allowed = function() {
  var ret = [];
  var users = Meteor.users.find().fetch();
  for(var x in users) {
    ret.push(users[x]._id);
  }
  return ret;
}

Widgets.schemas.approveInput = function() {
  return {
    title:{
      type: String,
      optional: false,
    },
    user:{
      type: String,
      allowedValues: allowed,
      autoform: {
        afFieldInput: {
          options: Meteor.userList
        }
      }
    }
  }
};

SimpleSchema.messages({notAllowed: "Not allowed"});
Fields.schemas.approveInput = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
        type: String,
        allowedValues: ["Approved", "Rejected"],
        autoform: {
          afFieldInput: {
            options: function () {
              return [{label:"Approved", value:"Approved"},
              {label:"Rejected", value:"Rejected"}];
            },
            type: function() {
              return (Meteor.userId() == data.user)?"select":"hidden";
            }
          },
          label: function() {
                return (Meteor.userId() == data.user)?true:false;
          }
        },
        optional: true,
        label: data.title,
        custom: function () {
          if (this.isSet && Meteor.userId() != data.user) {
            return "notAllowed";
          }
          return true;
        }
      };
      return output;
  };
