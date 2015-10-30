Template.editWidget.attachSchema(new SimpleSchema(_.extend({}, Meteor.schema(), Meteor.protectSchema())));

Template.EditWidget.helpers({
  isForm: function(widget) {
    if(widget) return widget.type == "formWidget";
  },
  isWidget: function(widget) {
    if(widget) return true;
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
