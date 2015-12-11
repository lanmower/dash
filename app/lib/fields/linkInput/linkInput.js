Meteor.fieldTypes.push({label:"Link Input", value: "linkInput"});
Widgets.schemas.linkInput = function() {
  return {
  title:{
    type: String,
    optional: false,
  }
}
};
if(Meteor.isClient) {
  Template.linkInput = {};
  Template.linkInput.cell = function(name, item, schema) {
    var output = "";
    _.each(item[name],function(item) {
      output += "<a href='"+item.value+"'>"+item.label+"</a><br/>"
    });
    return output;
  }
}
Fields.schemas.linkInput = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
        type: [Object],
        label: data.title
      };
  output[name+'.$.label'] = {
        type: String,
        label: 'label'
      };
  output[name+'.$.link'] = {
        type: String,
        label: 'link'
      };

  return output;

  };
