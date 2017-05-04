Template.EditWidget.helpers({
  getCol:function() {
    return Widgets;
  },
  fields: function() {
		var fields = Fields.find({parent:this._id},{sort: { listPosition: 1 }});
  },
  schema: function() {
    const instance = Template.instance();
    if(Pages.findOne({_id: this.parent})) {
      instance.schema = new SimpleSchema(core.createDisplaySchema(this.parent, this.type, Pages, Meteor.widgetTypes));
    }
    return instance.schema;
  }
});
Template.EditWidget.created = function () {
  var template = this;
  var destroyForm = new ReactiveVar(true);

  Template.EditWidget.helpers({
    destroyForm: function() {
      return destroyForm.get();
    },
  });

  template.autorun(function () {
    destroyForm.set(true);
  });

  template.autorun(function () {
    if (destroyForm.get()) {
      destroyForm.set(false);
    }
  });
};


Template.EditWidget.rendered = function() {
	var elem = $("table#items tbody");
	elem.sortable({
		revert: 100,
		update: function(event, ui) {
			// build a new array items in the right order, and push them
			var rows = $(event.target).children('tr');
			_.each(rows, function(element,index,list) {
				var id = $(element).data('id');
				Fields.update({_id: id}, {$set: {listposition: index}});
			});
		}
	});
}
