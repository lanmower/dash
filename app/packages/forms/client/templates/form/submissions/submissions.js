Template.submissionsCellButtons.helpers({
  form: function() {
    console.log(Router.current().params);
    return Router.current().params.form;
  }
});
