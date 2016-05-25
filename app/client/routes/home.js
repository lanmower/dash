Router.configure({
	layoutTemplate: "MasterLayout",
	notFoundTemplate: "NotFound",
});

Router.route('/', {
  name: 'home',
  controller: 'HomeController',
  template: 'ViewPage',
  waitOn: function() {
      return Meteor.subscribe("pageByPath", "home");
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
  where: 'client',
	title: 'Home'
});

T9n.setLanguage('en');

// Protect all Routes
//Router.plugin('ensureSignedIn');
