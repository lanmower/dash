AutoForm.hooks({
  updateForm: {
    onSuccess: function(formType, result) {
      Router.go('submissions', {_id:Router.current().params.form});
    }
  }
});

Template.updateForm.helpers({
  onSuccess:function() {
    var self = this;
    return function(result) {
      Router.go('submissions', {_id:self.form._id});
    }
  },
  onError:function() {
    return function(result) {
      console.log(result);
      //Router.go('pagesList');
    }
  },
  userName: function(id) {
    user = Meteor.users.findOne({_id:id});
    if(user) return user.profile.name;
  }
});
