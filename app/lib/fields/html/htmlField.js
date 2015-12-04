if(Meteor.isClient) {
  Template.afHtmlField.helpers({
    content: function() {
      return AutoForm.getSchemaForField(this.name).autoform.afFieldInput.content;
    }
  });
}

Widgets.schemas.htmlField = function() {
  return {
    content:{
      type: String,
      optional: false,
      autoform: {
        afFieldInput: {
          type: "summernote"
        }
      }
    },
    name:{
      type: String,
      optional: true,
      //autoform: {
      //  type: "hidden"
      //}
    }
  }
};

Meteor.startup(function () {
  if(Meteor.isClient) {
    AutoForm.addInputType("htmlField", {
      template: "afHtmlField",
    });
  }
});

Fields.schemas.htmlField = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
        type: String,
        label: "",
        optional: true,
        autoform: {
          label: " ",
          afFieldInput: {
            type: 'htmlField',
            content: data.content,
          }
        }
    };
    return output;

  };
