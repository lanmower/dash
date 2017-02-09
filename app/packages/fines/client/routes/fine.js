Router.route('fine/list', {
	parent: 'home',
  name: 'finesList',
  waitOn: function() {return this.subscribe("fines")},
  data: function() {
		return {
			col:Fines,
			fields: [
				'title', 
								{ key: 'buttons', label: '', tmpl: Template.finesListCellButtons}
							]
			};
  },
	title: 'List fines',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();
		}
});

Router.route('fine/insert', {
	parent: 'finesList',
	title: 'Insert fine',
  name: 'insertfine',
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();
		}
});

Router.route('fine/edit/:_id', {
  name: 'editfine',
	parent: 'finesList',
  waitOn: function() {return this.subscribe("fines")},
  data: function() {
    var fine = Fines.findOne({_id:this.params._id});
    return {fine:fine};
  },
	title: 'Edit fine',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();

		}

});
