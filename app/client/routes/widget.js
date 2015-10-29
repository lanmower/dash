Router.route('widget/edit/:_id', {
	parent: 'pagesList',
	title: 'Edit Widget',
  name: 'editWidget',
  waitOn: function() {
    return [
      Meteor.subscribe("types"),
      Meteor.subscribe("widget", this.params._id),
    ];
  },
  data: function () {
		var fields = Fields.find({parent:this.params._id},{sort: { listPosition: 1 }});
    var widget = Widgets.findOne({_id: this.params._id});
    var schema = null;

    if(widget && Pages.findOne({_id: widget.parent})) {
      schema = new SimpleSchema(createDisplaySchema(widget.parent, widget.type, Pages));
    }

    return {widget:widget, schema:schema, fields:fields};
  },
  fastRender: true,
  where: 'client'
});

Router.route('widget/insert/:parent', {
	parent: 'pagesList',
	title: 'Insert Widget',
  waitOn: function() {
    return[
      Meteor.subscribe("types"),
    	Meteor.subscribe("widget", this.params.parent)]
  },
  data: function () {
    var page = Pages.findOne({_id: this.params.parent});
    if(page) {
      var schema = new SimpleSchema(createDisplaySchema(page._id, null, Pages));
      return page;
    }
  },
  name: 'insertWidget',
  fastRender: true,
  where: 'client'
});
