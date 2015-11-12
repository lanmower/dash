Router.route('page/list', {
	parent: 'home',
  name: 'pagesList',
	title: 'List Pages',
  waitOn: function() {
    return Meteor.subscribe('pages');
  },
  data: function() {
    return {pages:Pages.find()};
  },
  fastRender: true,
  where: 'client'
});
Router.route('page/insert', {
	parent: 'pagesList',
	title: 'Insert Page',
  name: 'insertPage',
  waitOn: function() {
    return Meteor.subscribe('types');
  },
  fastRender: true,
  where: 'client'
});
Router.route('page/edit/:_id', {
	parent: 'pagesList',
	title: 'Edit Page',
  name: 'editPage',
  waitOn: function() {
    return [
      Meteor.subscribe("page", this.params._id),
      Meteor.subscribe("types")
    ];
  },
  data: function() {
    if(this.ready()){
      page = Pages.findOne({_id:this.params._id});
    	var widgets;
		  if(page) widgets = Widgets.find({parent:page._id});
      return {types:Types.find(), page:page, widgets:widgets};
    }
  },
  fastRender: true,
  where: 'client'
});
Router.route('/:path', {
	parent: 'home',
	//title: 'Edit Page',
  name: 'viewPageByPath',
  template: 'ViewPage',
  waitOn: function() {
      return Meteor.subscribe("pageByPath", this.params.path);
  },
  data: function() {
    if(this.ready()){
	    var page = Pages.findOne({path:{$regex : "(/)?.*"}});
	    Meteor.subscribe("widgets", page._id);
	    var widgets = Widgets.find({parent:page._id});
	    return {page:page, widgets:widgets};
    }
  },
  fastRender: true,
  where: 'client'
});
