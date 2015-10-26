formSchema = function(formWidget) {
  var fields = Fields.find({parent:formWidget._id});
  var schema = Meteor.schema();
  fields.forEach(function(field) {
    var name = field.name;
    schema[name] = schemaItem(field);
  });

  return new SimpleSchema(schema);
}

Widgets.schemas.formWidget = {
  title:{
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
