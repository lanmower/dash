Router.route('mail/list', {
	parent: 'home',
  name: 'mailList',
  data: function() {
  },
	title: 'Inbox',
  fastRender: true,
  where: 'client'
});
