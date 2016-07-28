Router.configure({
	layoutTemplate: "MasterLayout",
	notFoundTemplate: "NotFound",
});

Router.route('/', {
  name: 'home',
  template: 'ViewPage',
  waitOn: function() {
      return this.subscribe("pageByPath", "home");
  },
  data: function() {
    if(this.ready()){
	    var page = Pages.findOne({path:{$regex : "(/)?.*"}});
	    this.subscribe("Widgets", page._id);
	    var widgets = Widgets.find({parent:page._id});
	    return {page:page, Widgets:widgets};
    }
  },
  fastRender: true,
  where: 'client',
	title: 'Home'
});

T9n.setLanguage('en');

// Protect all Routes
//Router.plugin('ensureSignedIn');
