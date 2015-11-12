Template.updateForm.helpers({
  onSuccess:function() {
    var self = this;
    return function(result) {
      console.log(result);
      Router.go('submissions', {form:self.form._id});
    }
  },
  onError:function() {
    return function(result) {
      console.log(result);
      //Router.go('pagesList');
    }
  },
    getFileTypes: function() {
    var schema = this.schema;
    var files = [];
    for(var i in schema) {
      if(schema[i].autoform && schema[i].autoform.type == 'cfs-file') {
        files.push[i];
      }
    }
    return files;
  },
  getFile: function(parent) {
    return File.find(parent.item[this]);
  }
});

/*Template.updateForm.created = function () {
  var template = this;
  console.log(Template.currentData());
};*/
