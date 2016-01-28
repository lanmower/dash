Router.route('file/edit/:_id', {
  name: 'editFile',
	parent: 'filesList',
  waitOn: function() {return Meteor.subscribe("file", this.params._id)},
  data: function() {
    var file = Files.findOne({_id:this.params._id});
    return {file:file};
  },
	title: 'Edit File',
  fastRender: true,
  where: 'client'
});
