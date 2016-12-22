Meteor.fieldTypes.push({label:"User Select Input", value: "userSelectInput"});
Widgets.schemas.userSelectInput = function() {
  return {
    title:{
      type: String,
      optional: false
    }
  }
};
Fields.schemas.userSelectInput = function(data) {
  var name = data.name
  var users = Meteor.usersList()
  var allowed = [];
  _.each(users, function(user) {
        allowed.push(user.value);
  });
  var output = {};
  output[name] = {
        type: [String],
        optional: true,
        label: data.title,
        allowedValues: allowed,
        autoform: {
          //type: "universe-select",
          afFieldInput: {
            multiple: true,
            options: function () {
              return Meteor.usersList();
            }
          }
        }
    };
    return output;
  };
