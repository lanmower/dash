if(Meteor.isClient) {
  Router.route('form/approve/:form/:_id/:field/:setting', {
    title: 'Approve',
    name: 'approveForm',
    fastRender: true,
    where: 'client',
    onAfterAction: function() {
      Meteor.call("approve", this.params.field, this.params.form, this.params._id, Meteor.userId(), this.params.setting=="true"?true:false);
      Router.go("updateForm", {form:this.params.form, _id:this.params._id});
    },
  });
}
