AutoForm.hooks({
  updateForm: {
    onSuccess: function(formType, result) {
      Router.go('submissions', {form:Router.current().params.form});
    }
  }
});

Template.updateForm.helpers({
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
