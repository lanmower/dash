/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/


Template.widgetList.helpers({
  widgetSchema: function() {
    schema = gong.createDisplaySchema(Router.current().params._id, Widgets, Pages);
    schema.public.autoform = {type:'hidden'};
    schema.type.autoform.label = false;
    console.log(schema);
    return new SimpleSchema(schema);
  },
  getWidgetCol:function() {
    return Widgets;
  },
  widgets:function() {
  	const widgets = this.Widgets.fetch();
  	const self = this;
    return _.map(widgets, function (widget) {
         return _.extend(widget, {
             editing: self.editing,
             highlight: self.highlight,
         });
    });  	
  },
});

Template.widgetListItem.helpers({
  isEditing: function() {
    return this.editing.get(this._id)?'editing':'';
  }
  });

Template.EditPage.helpers({
  getWidgetCol:function() {
    return Widgets;
  },
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
  	return self.editing.get(this._id)?'editing':'';
  },
  isHighlighted: function() {
  	let self = Template.instance();
    return self.highlight.get(this._id)?'highlight':'';
  },
  editings: function() {
  	let self = Template.instance();
  	return self.editing;
  },
  highlights: function() {
  	let self = Template.instance();
  	return self.highlight;
  }
});


Template.widgetListItem.events({
	'click tr': function (evt) {
    var aTag = $("section[name='"+ this._id +"']");
    $('.content').scrollTo(aTag, 300);
	},
  "mouseenter tr": (event, template) => {
    template.data.highlight.set(template.data._id, true);
  },
  "mouseleave tr": (event, template) => {
    template.data.highlight.set(template.data._id, false);
  },
	'click .editButton': function (evt) {
	    let output = true;
      const aTag = $("section[name='"+ this._id +"']");
	    if(this.editing.get(this._id)) output = false;
  		this.editing.set(this._id, output);
        $('.content').scrollTo(aTag, 1000);
	},
})

Template.EditPage.onCreated(function() {
	this.editing = new ReactiveDict();
	this.highlight = new ReactiveDict();
});

Template.EditPage.rendered = function() {
	$(this.find(".widgetList")).dialog({
	  title: "Page Widgets",
  position: { my: "right top+75", at: "right-125 top" }
}).find("table#items tbody").sortable({
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
