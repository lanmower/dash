Router.route('type/list', {
	parent: 'home',
  name: 'typesList',
  waitOn: function() {return Meteor.subscribe("types")},
  data: function() {
    return {
      types:Types.find()
    }
  },
	title: 'List Types',
  fastRender: true,
  where: 'client'
});
Router.route('type/insert', {
	parent: 'typesList',
	title: 'Insert Type',
  name: 'insertType',
  where: 'client'
});
Router.route('type/edit/:_id', {
  name: 'editType',
	parent: 'typesList',
  waitOn: function() {return Meteor.subscribe("types")},
  data: function() {
    var type = Types.findOne({_id:this.params._id});
    return {obj:type};
  },
	title: 'Edit Type',
  fastRender: true,
  where: 'client'
});
