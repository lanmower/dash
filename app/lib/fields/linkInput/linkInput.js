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
    if(schema.titleref && item[schema.titleref]) label = item[schema.titleref]
    return "<a href='"+val+"'>"+label+"</a>";
  }
}
Fields.schemas.linkInput = function(data) {
      return {
        type: String,
        label: data.title
      }
  };
