Router.route('config/list', {
	parent: 'home',
  name: 'configList',
  //waitOn: function() {return Meteor.subscribe("config")},
  data: function() {
    return {
      configs:Config.find()
    }
  },
	title: 'List Configs',
  fastRender: true,
  where: 'client'
});
Router.route('config/insert', {
	parent: 'configList',
	title: 'Insert Config',
  name: 'insertConfig',
	fastRender: true,
  where: 'client'
});
Router.route('config/edit/:_id', {
  name: 'editConfig',
	parent: 'configList',
  //waitOn: function() {return Meteor.subscribe("config")},
  data: function() {
    var config = Config.findOne({_id:this.params._id});
    return {config:config};
  },
	title: 'Edit Config',
  fastRender: true,
  where: 'client'
});
