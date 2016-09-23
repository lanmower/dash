Router.route('mail/list/:user/:q?', {
	parent: 'home',
  name: 'mailList',
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
	    Meteor.call("gmailSearch",
	      Router.current().params.user,
	      Router.current().params.q,
	      function(err,data){
	        console.log(data)
	      }
	    );
		var user = this.params.user||Meteor.userId();
		this.subscribe('gmailSearch', user, this.params.q);
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
		return this.subscribe('gmailMsg', this.params._id);
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
