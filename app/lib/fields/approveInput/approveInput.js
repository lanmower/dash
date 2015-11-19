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

if(Meteor.isClient) {
    Template.approveInput.cell = function(name, item, schema) {
      var value = item[name];
      console.log(schema);
      var output = [];
      for(var x in schema) {
        var schemaItem = schema[x];
        if(schemaItem.type == 'approveInput')
          if(item[schemaItem.name] == schemaItem.user) output.push(Meteor.users.findOne({_id:item[schemaItem.name]}).profile.name);
      }
      return output.join();
    }
}

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
        optional: true,
        label: data.title
      }
  };
