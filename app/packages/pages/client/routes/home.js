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

Meteor.startup(function() {
  Router.route('/(.*)', function() {//regex for every route, must be last
      if (this.ready()) {
          document.title = "404";
          this.render('error');
      } else this.render('loading');
  })
});

T9n.setLanguage('en');

// Protect all Routes
//Router.plugin('ensureSignedIn');
