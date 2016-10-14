Router.route('schedule/list', {
	parent: 'home',
  name: 'schedulesList',
  waitOn: function() {return this.subscribe("schedules")},
  data: function() {
		return {col:Schedules, fields: ['title', { key: 'buttons', label: '',tmpl: Template.SchedulesListCellButtons}]};
  },
	title: 'List Schedules',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();

		}

});
Router.route('schedule/insert', {
	parent: 'schedulesList',
	title: 'Insert Schedule',
  name: 'insertSchedule',
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();

		}

});
Router.route('schedule/edit/:_id', {
  name: 'editSchedule',
	parent: 'schedulesList',
  waitOn: function() {return this.subscribe("schedules")},
  data: function() {
    var schedule = Schedules.findOne({_id:this.params._id});
    return {schedule:schedule};
  },
	title: 'Edit Schedule',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();

		}

});
