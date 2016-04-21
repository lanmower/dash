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
  Template.linkInput.cell = function(name, item, schema, field) {
    var output = item[name].label+"<br/>";
    _.each(item[name].links,function(link) {
      output += "<a href='"+link.link+"'>"+link.label+"</a><br/>"
    });
    return output;
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
