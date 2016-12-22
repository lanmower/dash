Router.route('file/edit/:_id', {
  name: 'editFile',
  parent: 'filesList',
  waitOn: function() {
    return this.subscribe("file", this.params._id)
  },
  data: function() {
    return {
      file: Files.findOne({
        _id: this.params._id
      })
    };
  },
  title: 'Edit File',
  fastRender: true,
  where: 'client'
});
