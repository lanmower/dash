Router.route('/login', {
	parent: 'login',
	//title: 'Edit Page',
  name: 'login',
  template: 'login',
  fastRender: true,
  where: 'client',
  data: function () {
		if(Meteor.userId()) Router.go('/');
  }
});
