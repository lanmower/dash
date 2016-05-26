Router.route('user/list', {
	parent: 'home',
  name: 'usersList',
	title: 'List Users',
  waitOn: function() { return Meteor.subscribe("users")},
  data: function() {
    return {
			users:Meteor.users.find()
		};
  },
  fastRender: true,
	onBeforeAction: function() {
		console.log('test');
	    if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
	      Router.go('/');
	    }
			this.next();
	  }
	});

Router.route('user/edit/:_id', {
  name: 'editUser',
	parent: 'usersList',
	title: 'Edit User',
	waitOn: function() {
    return [
      Meteor.subscribe("user", this.params._id),
    ];
  },
  data: function() {
    return Meteor.users.findOne({_id:this.params._id});
  },
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
	    if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
	    }
			this.next();
	  }
});

Router.route('user/profile', {
  name: 'editProfile',
	parent: 'usersList',
	title: 'Edit Profile',
  data: function() {
    return Meteor.user();
  },
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
	    if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
	    }
			this.next();

	  }
});
