AutoForm.hooks({
  updateAdminForm: {
    onSuccess: function(formType, result) {
      Router.go('submissionsAdmin', {_id:Router.current().params.form});
    }
  }
});

Template.updateAdminForm.helpers({
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
