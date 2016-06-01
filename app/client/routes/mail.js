Router.route('mail/list/:user/:q?', {
	parent: 'home',
  name: 'mailList',

	subscriptions: function() {
		return Meteor.subscribe('gmailSearch', Router.current().data().user,Router.current().params.q);
	},
	data: function() {
		var user = this.params.user||Meteor.userId();
		var messages = gmailSearch.findOne({user:user, query:this.params.q});
		if(messages) {
			return {
				user: user,
				messages: messages.search.messages,
			}
		}
		else {return {user:user, messages:null}};
  },
 	title: 'Inbox',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();

		}

});

Router.route('mail/view/:user/:_id', {
	parent: 'home',
  name: 'mailMessageView',
	subscriptions: function() {
		return Meteor.subscribe('gmailMsg', this.params._id);
	},
  data: function() {
			return {
				id: this.params._id,
				user: this.params.user,
				message: gmail.findOne({_id:this.params._id})
		  };
	},
	title: 'Read Message',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();

		}

});
