AutoForm.hooks({
  updateForm: {
    onSuccess: function(formType, result) {
      var route = Router.current().params.parent;
      var form = Forms.findOne({_id:Router.current().params.form});
      if(Roles.userIsInRole(Meteor.userId(), 'admin') ||
      Roles.userIsInRole(Meteor.userId(), form.collectionName+'admin'))
        return Router.go('submissionsAdmin', {form:Router.current().params.form});
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
  },
  userName: function(id) {
    user = Meteor.users.findOne({_id:id});
    if(user) return user.profile.name;
  }
});

/*Template.updateForm.created = function () {
var template = this;
console.log(Template.currentData());
};*/
