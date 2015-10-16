Router.configure({
	layoutTemplate: "MasterLayout",
	notFoundTemplate: "notFound",
});

Router.route('/', {
  name: 'home',
  controller: 'HomeController',
  where: 'client',
  fastRender: true,
	title: 'Home'
});
