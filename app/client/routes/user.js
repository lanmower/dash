Router.route('user/list', {
	parent: 'home',
  name: 'usersList',
	title: 'List Users',
  waitOn: function() { return Meteor.subscribe("users")},
  data: function() {
    return {users:Meteor.users.find()};
  },
  fastRender: true,
  where: 'client'
});
Router.route('user/edit/:_id', {
  name: 'editUser',
	parent: 'usersList',
	title: 'Edit User',
  data: function() {
    return Meteor.users.findOne({_id:this.params.id});
  },
  fastRender: true,
  where: 'client'
});
