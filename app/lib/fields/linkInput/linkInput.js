Widgets.schemas.linkInput = {
  title:{
    type: String,
    optional: false,
  },
  titleref:{
    type: String,
    optional: false,
  }
};
if(Meteor.isClient) {
  Template.linkInput.cell = function(name, item, schema) {
    var val = item[name];
    console.log(name, item, schema);
    var label = val;
    var schemaItem = schema[name];
    if(schemaItem.titleref && item[schemaItem.titleref]) label = item[schemaItem.titleref]
    return "<a href='"+val+"'>"+label+"</a>";
  }
}
Fields.schemas.linkInput = function(data) {
      return {
        type: String,
        label: data.title
      }
  };
