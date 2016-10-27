Router.route('messages/:userId', {
  name: 'message',
  title: 'Message',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
		Session.set('chat',Router.current().params.userId)
		Router.go('/');
		this.next();
	  }
});
