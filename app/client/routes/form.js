Router.route('form/edit/:form/:_id', {
  title: 'Update Form',
  name: 'editForm',
  fastRender: true,
  where: 'client',
  waitOn: function() {
    return [
      Meteor.subscribe("widget", this.params.form)
    ];
  },
  data: function () {
    var form = Widgets.findOne({_id:this.params.form});
    var collection;
    var item;
    var schema;
    if(form) {
      Meteor.subscribe(form.collectionName);
      collection = getCollection(form.collectionName);
      item = collection.findOne(this.params._id);
      schema = new SimpleSchema(formSchema(form));
    }
    return {
      form: form,
      item: item,
      collection: collection,
      id: this.params._id,
      schema: schema
    };
  }
});
