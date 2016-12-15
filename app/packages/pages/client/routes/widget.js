Router.route('widget/edit/:_id', {
	parent: 'pagesList',
	title: 'Edit Widget',
  name: 'editWidget',
  waitOn: function() {
    return [
      this.subscribe("widget", this.params._id),
    ];
  },
  data: function () {
    var widget = Widgets.findOne({_id: this.params._id});
    return widget;
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

Router.route('widget/insert/:parent', {
	parent: 'pagesList',
	title: 'Insert Widget',
  waitOn: function() {
    return[
    	this.subscribe("widget", this.params.parent)]
  },
  data: function () {
  },
  name: 'insertWidget',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();

		}

});
