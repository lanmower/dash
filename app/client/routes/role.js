Router.route('role/list', {
	parent: 'home',
  name: 'rolesList',
  waitOn: function() {return Meteor.subscribe("roles")},
  data: function() {
    return {
      roles:Meteor.roles.find()
    }
  },
	title: 'List Roles',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
		}

});

Router.route('role/insert', {
	parent: 'rolesList',
	title: 'Insert Role',
  name: 'insertRole',
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
		}

});

Router.route('role/edit/:_id', {
  name: 'editRole',
	parent: 'rolesList',
  waitOn: function() {return Meteor.subscribe("roles")},
  data: function() {
    var role = Meteor.roles.findOne({_id:this.params._id});
    return {obj:role};
  },
	title: 'Edit Role',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
		}

});
