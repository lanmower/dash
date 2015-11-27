if(Meteor.isClient) {
    Template.approveList.cell = function(name, item, schema) {
      var value = item[name];
      var output = [];
      console.log(schema);
      for(var x in schema) {
        var schemaItem = schema[x];
        if(schemaItem.type == 'approveInput')
          if(item[schemaItem.name] == 'Approved') output.push(Meteor.users.findOne({_id:schemaItem.user}).profile.name);
      }
      return output.join();
    }
}

Widgets.schemas.approveList = {
    title:{
      type: String,
      optional: false,
    }
};

Fields.schemas.approveList = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
        type: String,
        optional: true,
        autoform: {
          type: "hidden"
        }
    };
    return output;

  };
