Router.route('form/edit/:_id', {
  title: 'Update Form',
  name: 'editForm',
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
      schema = createDisplaySchema(field.parent, field.type, Widgets);
    }
    return {field:field, schema:schema};
  }
});


Router.route('form/insert/:parent', {
	title: 'Insert Form',
  waitOn: function() {
    return[
      Meteor.subscribe("types"),
    	Meteor.subscribe("widget", this.params.parent)]
  },
  data: function () {
    var widget = Widgets.findOne({_id: this.params.parent});
    if(widget) {
      var schema = createDisplaySchema(widget._id, null, Widgets);
      return page;
    }
  },
  name: 'insertForm',
  fastRender: true,
  where: 'client'
});
