if(Meteor.isClient) {
  Router.route('form/approve/:doc/:field/:setting', {
    title: 'Approve',
    name: 'approveForm',
    fastRender: true,
    where: 'client',
    onAfterAction: function() {
      var router = this;
      this.subscribe("field", Router.current().params.field, {
        onReady: function () {
          var field = Fields.findOne({_id:router.params.field});
              if(Meteor.userId(), _.contains(field.admins, Meteor.userId())) {
                console.log('approving');
                Meteor.call("approve", router.params.field, router.params.doc, Meteor.userId(), router.params.setting=="true"?true:false,function(error, result) {
                  Router.go("updateForm", {form:field.parent, _id:router.params.doc});
                });
              }
        },
        onError: function () { console.log("onError", arguments); }
      });
    },
  });
}
