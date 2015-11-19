if(Meteor.isClient) {
    Template.approveList.cell = function(name, item, schema) {
      var value = item[name];
      var output = [];
      for(var x in schema) {
        var schemaItem = schema[x];
        console.log(schemaItem);
        if(schemaItem.type == 'approveInput')
          if(item[schemaItem.name] == schemaItem.user) output.push(Meteor.users.findOne({_id:item[schemaItem.name]}).profile.name);
      }
      console.log(output);
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
      return {
        type: String,
        optional: true,
        autoform: {
          type: "hidden"
        }
      }
  };
