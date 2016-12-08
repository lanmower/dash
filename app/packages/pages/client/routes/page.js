Router.route('page/list', {
	parent: 'home',
  name: 'pagesList',
	title: 'List Pages',
	waitOn: function() {
    return Meteor.subscribe('pages');
  },
  data: function() {
    return {col:Pages, fields: ['title', { key: 'buttons', label: '',tmpl: Template.PagesListCellButtons}]};
  },
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();
		}

});
Router.route('page/insert', {
	parent: 'pagesList',
	title: 'Insert Page',
  name: 'insertPage',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
		console.log('page');
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				console.log("redirect not authed");
				Router.go('/');
			}
			this.next();

		}
});

Router.route('page/edit/:_id', {
	parent: 'pagesList',
	title: 'Edit Page',
  name: 'editPage',
  waitOn: function() {
    return [
      this.subscribe("page", this.params._id)
    ];
  },
  data: function() {
    if(this.ready()) {
      page = Pages.findOne({_id:this.params._id});
    	var widgets;
		  if(page) widgets = Widgets.find({parent:page._id}, {sort:{listposition:1}});
      return {types:Meteor.widgetTypes, page:page, Widgets:widgets};
    }
  },
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();
		}
});

Router.route('/page/:path', {
	parent: 'home',
	//title: 'Edit Page',
  name: 'viewPageByPath',
  template: 'ViewPage',
  waitOn: function() {
      return this.subscribe("pageByPath", this.params.path);
  },
  data: function() {
    if(this.ready()){
	    var page = Pages.findOne({path:this.params.path});
	    this.subscribe("Widgets", page._id);
	    var widgets = Widgets.find({parent:page._id}, {sort:{listposition:1}});
	    return {page:page, Widgets:widgets};
    }
  },
  fastRender: true,
  where: 'client'
});
