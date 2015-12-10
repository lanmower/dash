Router.route('field/edit/:_id', {
  parent: 'editForm',
  title: 'Edit Field',
  name: 'editField',
  fastRender: true,
  where: 'client',
  waitOn: function() {
    return [
      Meteor.subscribe("users"),
      Meteor.subscribe("field", this.params._id)
    ];
  },
  data: function () {
    var schema = null;
    var field = Fields.findOne({_id: this.params._id});
    if(field && Widgets.findOne({_id: field.parent})) {
      Meteor.subscribe('form', field.parent);
      schema = new SimpleSchema(createDisplaySchema(field.parent, field.type, Widgets, Meteor.fieldTypes));
    }
    return {field:field, schema:schema};
  }
});

Router.route('field/insert/:parent', {
	parent: function() {
    return 'editForm'+this.params.parent;
  },
	title: 'Insert Field',
  waitOn: function() {
    return[
    	Meteor.subscribe("widget", this.params.parent)]
  },
  data: function () {
    var widget = Widgets.findOne({_id: this.params.parent});
    if(widget) {
      var schema = new SimpleSchema(createDisplaySchema(widget._id, null, Widgets, Meteor.fieldTypes));
      return widget;
    }
  },
  name: 'insertField',
  fastRender: true,
  where: 'client'
});
