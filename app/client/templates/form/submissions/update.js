AutoForm.hooks({
  updateForm: {
    onSuccess: function(formType, result) {
      var route = Router.current().params.parent;
      Router.go('submissions', {form:Router.current().params.form});
    }
  }
});

Template.updateForm.helpers({
  onSuccess:function() {
    var self = this;
    return function(result) {
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
    var schema = this.schema.schema();
    var files = [];
    for(var i in schema) {
      if(schema[i].autoform && schema[i].autoform.afFieldInput && schema[i].autoform.afFieldInput.type == 'cfs-file') {
        files.push(i);
      }
    }
    console.log(files);
    return files;
  },
  getFile: function(parent) {
    if(parent.item && parent.item[this]) {
      return Files.findOne(parent.item[this]);
    }
  }
});

/*Template.updateForm.created = function () {
var template = this;
console.log(Template.currentData());
};*/
