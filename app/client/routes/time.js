Router.route('time/list', {
	parent: 'home',
  name: 'timesList',
  waitOn: function() {return Meteor.subscribe("times")},
  data: function() {
    return {
      times:Times.find()
    }
  },
	title: 'List Times',
  fastRender: true,
  where: 'client'
});

Router.route('time/insert', {
	parent: 'timesList',
	title: 'Insert Time',
  name: 'insertTime',
  where: 'client'
});

Router.route('time/edit/:_id', {
  name: 'editTime',
	parent: 'timesList',
  waitOn: function() {return Meteor.subscribe("times")},
  data: function() {
    var time = Times.findOne({_id:this.params._id});
    return {obj:time};
  },
	title: 'Edit Time',
  fastRender: true,
  where: 'client'
});
