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
Router.route('messages', {
  name: 'messageList',
  title: 'Message',
  fastRender: true,
  where: 'client'
});
