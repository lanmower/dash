Router.route('mail/list', {
	parent: 'home',
  name: 'mailList',
  data: function() {
  },
	title: 'Inbox',
  fastRender: true,
  where: 'client'
});

Router.route('mail/view/:id', {
	parent: 'home',
  name: 'mailMessageView',
  data: function() {
		return {id:this.params.id};
  },
	title: 'Read Message',
  fastRender: true,
  where: 'client'
});
