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
  Template.linkInput.cell = function(schema, item) {
    var output = item[schema.name].label+"<br/>";
    _.each(item[schema.name].links,function(link) {
      output += "<a href='"+link.link+"'>"+link.label+"</a><br/>"
    });
    return Spacebars.SafeString(output);
  }
}
Fields.schemas.linkInput = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
        type: Object,
        label: data.title
      };
  output[name+'.label'] = {
        type: String,
        label: 'Title'
      };
  output[name+'.links'] = {
        type: [Object],
        label: 'Links'
      };
  output[name+'.links.$.label'] = {
        type: String,
        label: 'label'
      };
  output[name+'.links.$.link'] = {
        type: String,
        label: 'link'
      };

  return output;

  };
