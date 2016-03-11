if(Meteor.isClient) {
  Router.route('form/approve/:form/:_id/:field/:setting', {
    title: 'Approve',
    name: 'approveForm',
    fastRender: true,
    where: 'client',
    waitOn: function() {
      return [
  			this.subscribe("form", this.params.form),
  			this.subscribe("submission", this.params.form, this.params._id)
  		];
    },
    data: function () {
      var form = Forms.findOne({_id:this.params.form});
      var field;
      var collection;
      var item;
      var schema;
      if(form) {
        collection = getCollection(form.collectionName);
        item = collection.findOne(this.params._id);
  			var fschema = formSchema(form);
        schema = new SimpleSchema(fschema);
        field = Fields.findOne({_id:this.params.field});
        if(field) {
          if(field.type != "approveInput") throw Meteor.Error(400, "Incorrect type");
          field = field.name;
        }
      }
      return {
        form: form,
        item: item,
        collection: collection,
        id: this.params._id,
        schema: schema,
        fschema: fschema,
        field: field
      };
    }
  });
}

if(Meteor.isClient) {
  Template.approveForm.helpers({
    approve: function() {
    //this.find('.approval').html("");
    var router = Router.current();
    if(router.data().form && router.data().fschema[router.data().field]) {
      var setting = (router.params.setting == true)?true:false;
      var set = {};
      set[router.data().field] = setting;
      var collectionName = router.data().form.collectionName;
      getCollection(collectionName).update({_id: router.params._id}, {$set: set});
      Router.go("updateForm", {form:router.params.form, _id:router.params._id});
    }
  }
});
}
