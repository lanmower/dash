Router.route('field/edit/:_id', {
  parent: 'editWidget',
  title: 'Edit Field',
  name: 'editField',
  fastRender: true,
  where: 'client',
  waitOn: function() {
    return [
      Meteor.subscribe("types"),
      Meteor.subscribe("field", this.params._id)
    ];
  },
  data: function () {
    var schema = null;
    var field = Fields.findOne({_id: this.params._id});
    if(field && Widgets.findOne({_id: field.parent})) {
      schema = new SimpleSchema(createDisplaySchema(field.parent, field.type, Widgets));
    }
    console.log(field);
    return {field:field, schema:schema};
  }
});

Router.route('field/insert/:parent', {
	parent: 'pagesList',
	title: 'Insert Field',
  waitOn: function() {
    return[
      Meteor.subscribe("types"),
    	Meteor.subscribe("widget", this.params.parent)]
  },
  data: function () {
    var widget = Widgets.findOne({_id: this.params.parent});
    if(widget) {
      var schema = new SimpleSchema(createDisplaySchema(widget._id, null, Widgets));
      return widget;
    }
  },
  name: 'insertField',
  fastRender: true,
  where: 'client'
});
