formSchema = function(formWidget) {
  var fields = Fields.find({parent:formWidget._id},{sort: { listposition: 1 }});

  var schema = Meteor.schema();
  fields.forEach(function(field) {
    if(field.name) {
      var name = field.name;
      schema[name] = schemaItem(field);
    }
  });
  return schema;
}

Widgets.schemas.formWidget = {
  title:{
    type: String,
    optional: false,
  },
  collectionName:{
    type: String,
    optional: false,
  },
  types:{
        type: [String],
        autoform: {
          type: "universe-select",
          afFieldInput: {
            multiple: true,
            options: function () {
              return Types.find({}, {}).fetch();
            }
          }
        }
    },
    "types.$": {
          type: String,
          optional: true,
      },
};
