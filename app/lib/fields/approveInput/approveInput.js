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

Widgets.schemas.approveInput = {
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
};

Fields.schemas.approveInput = function(data) {
      return {
        type: String,
        allowedValues: ["Approved", "Rejected"],
        autoform: {
          afFieldInput: {
            options: function () {
              return [{label:"Approved", value:"Approved"},
              {label:"Rejected", value:"Rejected"}];
            }
          }
        },
        optional: true,
        label: data.title
      }
  };
