Router.route('task/list/:done?', {
	parent: 'home',
	name: 'tasksList',
	subscriptions: function() {
		return [this.subscribe("tasks"), this.subscribe("users")]
	},
	data: function() {
		let tasks;
		if (this.params.done != 'true') {
			tasks = Tasks.find({
				$or: [{
					complete: {
						$exists: false
					}
				}, {
					complete: 'false'
				}]
			});
		}
		else {
			tasks = Tasks.find({
				$and: [{
					complete: {
						$exists: true
					}
				}, {
					complete: 'true'
				}]
			});
		}
		return {
			col: tasks,
			fields: ['title', {key:'description', label:'',tmpl:Template.taskDescriptionCell}, {
				key: 'buttons',
				label: '',
				tmpl: Template.TasksListCellButtons
			}]
		};
	},
	title: 'List Tasks',
	fastRender: true,
	where: 'client',
	/*onBeforeAction: function() {
		if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])) {
			Router.go('/');
		}
		this.next();

	}*/
});

Router.route('task/insert', {
	parent: 'tasksList',
	title: 'Insert Task',
	name: 'insertTask',
	where: 'client',
	waitOn: function() {
		return [this.subscribe("tasks"), this.subscribe("users")]
	},
	onBeforeAction: function() {
		if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])) {
			Router.go('/');
		}
		this.next();
	}
});

Router.route('task/finish/:_id', {
	parent: 'completeTask',
	title: 'Complete Task',
	name: 'completeTask',
	where: 'client',
	onBeforeAction: function() {
		Tasks.update({
			_id: this.params._id
		}, {
			$set: {
				complete: true
			}
		});
		Router.go("tasksList");
	}
});

Router.route('task/edit/:_id', {
	name: 'editTask',
	parent: 'tasksList',
	waitOn: function() {
		return [this.subscribe("tasks"), this.subscribe("users")]
	},
	data: function() {
		var task = Tasks.findOne({
			_id: this.params._id
		});
		return {
			task: task
		};
	},
	title: 'Edit Task',
	fastRender: true,
	where: 'client',
	/*onBeforeAction: function() {
		if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])) {
			Router.go('/');
		}
		this.next();

	}*/

});

AutoForm.hooks({
	insertTaskForm: {
		onSuccess: function(formType, result) {
			Router.go('tasksList');
		}
	},
	editTaskForm: {
		onSuccess: function(formType, result) {
			Router.go('tasksList');
		}
	}
});
