
Template.EditForm.rendered = function() {
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
