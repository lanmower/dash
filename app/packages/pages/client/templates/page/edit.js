/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/


Template.widgetList.helpers({
  widgets:function() {
  	const widgets = this.Widgets.fetch();
  	const self = this;
    return _.map(widgets, function (widget) {
         return _.extend(widget, {
             editing: self.editing,
         });
    });  	
  },
  isEditing: function() {
    return this.editing.get(this._id);
  },
});

Template.EditPage.helpers({
  onSuccess:function() {
    return function() {
      Router.go('pagesList');
    }
  },
  getCol:function() {
    return Pages;
  },
  isEditing: function() {
  	let self = Template.instance();
  	return self.editing.get(this._id);
  },
  editings: function() {
  	let self = Template.instance();
  	return self.editing;
  }
});

jQuery.fn.scrollTo = function(elem, speed) { 
    $(this).animate({
        scrollTop:  $(this).scrollTop() - $(this).offset().top + $(elem).offset().top 
    }, speed == undefined ? 1000 : speed); 
    return this; 
};

Template.widgetList.events({
	'click tr': function (evt) {
    var aTag = $("a[name='"+ this._id +"']");
    $('.content').scrollTo(aTag, 300);
	},
	'click .editButton': function (evt) {
	    let output = true;
        const aTag = $("a[name='"+ this._id +"']");
	    if(this.editing.get(this._id)) output = false;
		this.editing.set(this._id, output);
        $('.content').scrollTo(aTag, 300);
	},
})

Template.EditPage.onCreated(function() {
	this.editing = new ReactiveDict();
});

Template.EditPage.rendered = function() {
	$(this.find(".widgetList")).dialog().find("table#items tbody").sortable({
		revert: 100,
		update: function(event, ui) {
			// build a new array items in the right order, and push them
			var rows = $(event.target).children('tr');
			_.each(rows, function(element,index,list) {
				var id = $(element).data('id');
				Widgets.update({_id: id}, {$set: {listposition: index}});
			});
		}
	});
}
