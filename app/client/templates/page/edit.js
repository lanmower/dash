/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.EditPage.helpers({
  onSuccess:function() {
    return function() {
      Router.go('pagesList');
    }
  }
});
Template.EditPage.rendered = function() {
	var elem = $("table#items tbody");
	elem.sortable({
		revert: 100,
		update: function(event, ui) {
			// build a new array items in the right order, and push them
			var rows = $(event.target).children('tr');
			_.each(rows, function(element,index,list) {
				var id = $(element).data('id');
        console.log(id);
				Widgets.update({_id: id}, {$set: {listposition: index}});
			});
		}
	});
}
