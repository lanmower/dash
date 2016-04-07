Router.route('form/list', {
	parent: 'home',
  name: 'formsList',
	title: 'List Forms',
  waitOn: function() {
    return Meteor.subscribe('forms');
  },
  data: function() {
    return {forms:Forms.find()};
  },
  fastRender: true,
  where: 'client'
});

Router.route('form/insert', {
	parent: 'formsList',
	title: 'Insert Form',
  name: 'insertForm',
  fastRender: true,
  where: 'client'
});

Router.route('form/edit/:form', {
	parent: 'formsList',
	title: 'Edit Form',
  name: 'editForm',
  waitOn: function() {
    return [
      Meteor.subscribe("form", this.params.form)
    ];
  },
  data: function() {
    if(this.ready()){
      form = Forms.findOne({_id:this.params.form});
      var fields = Fields.find({parent:form._id});
      return {types:Meteor.fieldTypes, form:form, fields:fields};
    }
  },
  fastRender: true,
  where: 'client'
});

Router.route('form/update/:form/:_id', {
  title: 'Update',
  name: 'updateForm',
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
    var collection;
    var item;
    var schema;
    if(form) {
      collection = getCollection(form.collectionName);
      item = collection.findOne(this.params._id);
			var fschema = formSchema(form);
      schema = new SimpleSchema(fschema);
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

Router.route('form/updateAdmin/:form/:_id', {
  title: 'Update',
  name: 'updateAdminForm',
  fastRender: true,
  where: 'client',
  waitOn: function() {
		this.subscribe("form", this.params.form),
		this.subscribe("submission", this.params.form, this.params._id)
  },
  data: function () {
		var form = Forms.findOne({_id:this.params.form});
    var collection;
    var item;
    var schema;
    if(form) {
      collection = getCollection(form.collectionName);
      item = collection.findOne(this.params._id);
			var fschema = formSchema(form);
      schema = new SimpleSchema(fschema);
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

Router.route('form/submit/:_id', {
  title: 'Submit',
  name: 'submitForm',
  fastRender: true,
  where: 'client',
  waitOn: function() {
    return [
      Meteor.subscribe("form", this.params._id)
    ];
  },
  data: function () {
    var form = Forms.findOne({_id:this.params._id});
    return form;
  }
});

Router.route('form/list/:_id', {
  title: 'Submissions',
  name: 'submissions',
  fastRender: true,
  where: 'client',
  waitOn: function() {
    return [
      Meteor.subscribe("form", this.params._id)
    ];
  },
  data: function () {
    var form = Forms.findOne({_id:this.params._id});
    return form;
  }
});

Router.route('form/admin/:_id', {
  title: 'Admin',
  name: 'submissionsAdmin',
  fastRender: true,
  where: 'client',
  waitOn: function() {
    return [
      Meteor.subscribe("form", this.params._id)
    ];
  },
  data: function () {
    var form = Forms.findOne({_id:this.params._id});
    return form;
  }
});
