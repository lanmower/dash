Router.route('form/list', {
	parent: 'home',
  name: 'formsList',
	title: 'List Forms',
  waitOn: function() {
    return Meteor.subscribe('forms');
  },
  data: function() {
    return {forms:Forms.find(), col:Forms, fields: ['title', 'collectionName', { key: 'buttons', label: '',tmpl: Template.FormsListCellButtons}]};
  },
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();
		}

});

Router.route('form/insert', {
	parent: 'formsList',
	title: 'Insert Form',
  name: 'insertForm',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();
		}

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
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();
		}

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
      collection = getCollection(this.params.form);
      item = collection.findOne(this.params._id);
			var fschema = formSchema(form);
      schema = new SimpleSchema(fschema);
    }
    var title = "";
    if(form) title = form.title;
    return {
      form: form,
      item: item,
      title:title,
      currentForm: Router.current().params.form,
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
		Meteor.subscribe("form", this.params.form),
		Meteor.subscribe("submission", this.params.form, this.params._id),
		Meteor.subscribe("users")
  },
  data: function () {
		var form = Forms.findOne({_id:this.params.form});
    var collection;
    var item;
    var schema;
    if(form) {
      collection = getCollection(this.params.form);
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

Router.route('form/submit/:form', {
  title: 'Submit',
  name: 'submitForm',
  fastRender: true,
  where: 'client',
  waitOn: function() {
    return [
      Meteor.subscribe("form", this.params.form)
    ];
  },
  data: function () {
    var form = Forms.findOne({_id:this.params.form});
    return form;
  }
});

Router.route('form/list/:form', {
  title: 'Submissions',
  name: 'submissions',
  fastRender: true,
  where: 'client',
	loadingTemplate: 'loading',
  waitOn: function() {
    return [
      Meteor.subscribe("form", this.params.form)
    ];
  },
  data: function () {

    var form = Forms.findOne({_id:this.params.form});


		var canAdmin = false;
		var listSchema = Fields.find({parent:this.params.form},{sort: { listposition: 1 }}).fetch();

		if(Roles.userIsInRole(Meteor.userId(), "admin")) canAdmin = true;
    if(Roles.userIsInRole(Meteor.userId(), this.params.form+"-admin")) canAdmin = true;
    if(this.ready()) {
			var schema = [];
			_.each(listSchema, function(base) {
				var item = {};
				item.label = base.title;
				item.key = base.name;
				item.fn = function(data, item) {
					if(Template[base['type']] && Template[base['type']].cell) return Template[base['type']].cell(base.name, item, base);
					return data; 
				};
				if(base.listable) {
          schema.push(item);
        }
			});
			schema.push({ key: 'Actions', label: '',tmpl: Template.submissionsCellButtons});
      console.log(schema);
      var title = "";
      if(form) title = form.title;
			return {
				form:form,
        title:title,
				fields: schema,
				currentForm: Router.current().params.form,
				col: getCollection(this.params.form),
				canAdmin: canAdmin
			};
		}
  }

});

Router.route('form/admin/:form', {
  title: 'Admin',
  name: 'submissionsAdmin',
  fastRender: true,
  where: 'client',
  data: function () {
		var form = Forms.findOne({_id:this.params.form});
		var canAdmin = false;
		if(Roles.userIsInRole(Meteor.userId(), "admin")) canAdmin = true;
    if(Roles.userIsInRole(Meteor.userId(), this.params.form+"-admin")) canAdmin = true;
    if(this.ready()) {
			var schema = [];
      schema.push({ key: 'createdBy', label: 'User', fn: function(value) {
        user = Meteor.users.findOne(value);
        if(user) return user.profile.name;
        }
      });
			_.each(listSchema(this.params.form), function(base) {
				var item = {};
				item.label = base.title;
				item.key = base.name;
				if(base.listable) schema.push(item);
			});
			schema.push({ key: 'Actions', label: '',tmpl: Template.submissionsAdminCellButtons});
      var title = "";
      if(form) title=form.title;

			return {
				form:form,
        title:title,
				fields: schema,
				currentForm: Router.current().params.form,
				col: Router.current().params.form+"-admin",
				canAdmin: canAdmin
			};
		}
	}
});
