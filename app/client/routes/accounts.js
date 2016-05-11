Router.route('/login', {
	parent: 'login',
	//title: 'Edit Page',
  name: 'login',
  template: 'login',
  fastRender: true,
  where: 'client'
});
