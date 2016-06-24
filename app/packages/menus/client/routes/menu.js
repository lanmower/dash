Router.route('menu/list', {
	parent: 'home',
  name: 'menusList',
  waitOn: function() {return this.subscribe("menus")},
  data: function() {
    return {
      menus:Menus.find()
    }
  },
	title: 'List Menus',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();

		}

});
Router.route('menu/insert', {
	parent: 'menusList',
	title: 'Insert Menu',
  name: 'insertMenu',
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();

		}

});
Router.route('menu/edit/:_id', {
  name: 'editMenu',
	parent: 'menusList',
  waitOn: function() {return this.subscribe("menus")},
  data: function() {
    var menu = Menus.findOne({_id:this.params._id});
    return {menu:menu};
  },
	title: 'Edit Menu',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();

		}

});
