Router.route('field/edit/:form/:_id', {
  parent: 'editForm',
  title: 'Edit Field',
  name: 'editField',
  fastRender: true,
  where: 'client',
  waitOn: function() {
    return [
      Meteor.subscribe("users"),
      Meteor.subscribe("field", this.params._id)
    ];
  },
  data: function () {
    var field = Fields.findOne({_id: this.params._id});
    if(field) {
      var formSchema = {name:{type:String}};
      _.extend(
        formSchema,
        createDisplaySchema(field.parent, field.type, Forms, Meteor.fieldTypes));
      formSchema.listable = {
        type: Boolean,
        label: "Display in list?"
      };
      return {field:field, schema:new SimpleSchema(formSchema)};
    }

  },
	onBeforeAction: function() {
			if (!Meteor.user() || Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
		}

});

Router.route('field/insert/:parent', {
	parent: function() {
    return 'editForm'+this.params.parent;
  },
	title: 'Insert Field',
  waitOn: function() {
    return[
    	Meteor.subscribe("form", this.params.parent)]
  },
  data: function () {
    var form = Forms.findOne({_id: this.params.parent});
    return form;
  },
  name: 'insertField',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
		}

});
