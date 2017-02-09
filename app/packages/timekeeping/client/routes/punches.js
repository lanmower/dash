Router.route('punch/list', {
	parent: 'home',
  name: 'punchesList',
  waitOn: function() {return this.subscribe("punches")},
  data: function() {
		return {col:Punches, fields: [{key:'creatorName', label: 'Creator'}, 'time','note', { key: 'buttons', label: '',tmpl: Template.PunchesListCellButtons}]};
  },
	title: 'List Punches',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();
		}
});

Router.route('punch/insert', {
	parent: 'punchesList',
	title: 'Insert Punch',
  name: 'insertPunch',
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();

		}

});
Router.route('punch/edit/:_id', {
  name: 'editPunch',
	parent: 'punchesList',
  waitOn: function() {return this.subscribe("punches")},
  data: function() {
    var punch = Punches.findOne({_id:this.params._id});
    return {punch:punch};
  },
	title: 'Edit Punch',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();

		}

});


AutoForm.hooks({
  insertPunchForm: {
    onSuccess: function(formType, result) {
      Router.go('home');
    }
  }
});
