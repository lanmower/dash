Router.configure({
	layoutTemplate: "MasterLayout",
	notFoundTemplate: "NotFound",
});

Router.route('/', {
  name: 'home',
  controller: 'HomeController',
  where: 'client',
  fastRender: true,
	title: 'Home'
});

T9n.setLanguage('en');

// Protect all Routes
//Router.plugin('ensureSignedIn');
