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
    mailSubject:{
      type: String,
      optional: false,
      autoform: {
        afFieldInput: {
          //value:"Your form submission has been approved"
        }
      }
    },
    mailMessage:{
      type: String,
      optional: false,
      autoform: {
        afFieldInput: {
          //value:"Your form submission has been approved"
        }
      }
    },
    mailMessageHtml:{
      type: String,
      optional: false,
      autoform: {
        afFieldInput: {
          type: 'summernote',
          //value:"<h1>Your form submission has been approved<h1> Click <a>here</a>"
        }
      }
    },
    min:{
      type: Number,
      optional: false
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
        allowedValues: [data.user, "Rejected"],
        autoform: {
          afFieldInput: {
            options: function () {
              return [{label:"Approved", value:Meteor.userId()},
              {label:"Rejected", value:"Rejected"}];
            }
          }
        },
        autoValue: function(val, val2) {
          if (this.isUpdate) {
            return;
          }
        },
        optional: true,
        label: data.title
      }
  };
