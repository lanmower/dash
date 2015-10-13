if(Meteor.isClient)
Accounts.ui.config({
    requestPermissions: {
        google:['https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/tasks'],
    },
    forceApprovalPrompt: {google: true},
    requestOfflineToken: {google: true}
    //passwordSignupFields: 'EMAIL_ONLY',
    //extraSignupFields: []
}
);

Router.configure({
	layoutTemplate: "MasterLayout",
	notFoundTemplate: "notFound",
});
Router.route('/', {
  name: 'home',
  controller: 'HomeController',
  where: 'client',
  fastRender: true,
	title: 'Home'
});
Router.route('page/list', {
	parent: 'home',
  name: 'pagesList',
	title: 'List Pages',
  waitOn: function() {
    return Meteor.subscribe('pages');
  },
  data: function() {
    return {pages:Pages.find()};
  },
  fastRender: true,
  where: 'client'
});
Router.route('page/insert', {
	parent: 'pagesList',
	title: 'Insert Page',
  name: 'insertPage',
  waitOn: function() {
    return Meteor.subscribe('types');
  },
  fastRender: true,
  where: 'client'
});
Router.route('page/edit/:_id', {
	parent: 'pagesList',
	title: 'Edit Page',
  name: 'editPage',
  waitOn: function() {
    return [
      Meteor.subscribe("page", this.params._id),
      Meteor.subscribe("types")
    ];
  },
  data: function() {
    if(this.ready()){
      page = Pages.findOne({_id:this.params._id});
      var widgets = Widgets.find({parent:page._id});
      return {types:Types.find(), page:page, widgets:widgets};
    }
  },
  fastRender: true,
  where: 'client'
});
Router.route('/:path', {
	parent: 'home',
	//title: 'Edit Page',
  name: 'viewPageByPath',
  template: 'ViewPage',
  waitOn: function() {
      return Meteor.subscribe("pageByPath", this.params.path);
  },
  data: function() {
    if(this.ready()){
    var page = Pages.findOne({path:{$regex : "(/)?.*"}});
    Meteor.subscribe("widgets", page._id);
    var widgets = Widgets.find({parent:page._id});
    return {page:page, widgets:widgets};
    }
  },
  fastRender: true,
  where: 'client'
});
Router.route('user/list', {
	parent: 'home',
  name: 'usersList',
	title: 'List Users',
  waitOn: function() { return Meteor.subscribe("users")},
  data: function() {
    return {users:Meteor.users.find()};
  },
  fastRender: true,
  where: 'client'
});
Router.route('user/edit/:_id', {
  name: 'editUser',
	parent: 'usersList',
	title: 'Edit User',
  data: function() {
    return Meteor.users.findOne({_id:this.params.id});
  },
  fastRender: true,
  where: 'client'
});

Router.route('type/list', {
	parent: 'home',
  name: 'typesList',
  waitOn: function() {return Meteor.subscribe("types")},
  data: function() {
    return {
      types:Types.find()
    }
  },
	title: 'List Types',
  fastRender: true,
  where: 'client'
});
Router.route('type/insert', {
	parent: 'typesList',
	title: 'Insert Type',
  name: 'insertType',
  where: 'client'
});
Router.route('type/edit/:_id', {
  name: 'editType',
	parent: 'typesList',
  waitOn: function() {return Meteor.subscribe("types")},
  data: function() {
    var type = Types.findOne({_id:this.params._id});
    return {obj:type};
  },
	title: 'Edit Type',
  fastRender: true,
  where: 'client'
});

Router.route('menu/list', {
	parent: 'home',
  name: 'menusList',
  waitOn: function() {return Meteor.subscribe("menus")},
  data: function() {
    return {
      menus:Menus.find()
    }
  },
	title: 'List Menus',
  fastRender: true,
  where: 'client'
});
Router.route('menu/insert', {
	parent: 'menusList',
	title: 'Insert Menu',
  name: 'insertMenu',
  where: 'client'
});
Router.route('menu/edit/:_id', {
  name: 'editMenu',
	parent: 'menusList',
  waitOn: function() {return Meteor.subscribe("menu", this.params._id)},
  data: function() {
    return Menus.findOne({_id:this.params._id});
  },
	title: 'Edit Menu',
  fastRender: true,
  where: 'client'
});

Router.route('widget/edit/:_id', {
	parent: 'pagesList',
	title: 'Edit Widget',
  name: 'editWidget',
  waitOn: function() {
    return [
      Meteor.subscribe("types"),
      Meteor.subscribe("widget", this.params._id)
    ];
  },
  before: function() {
   // let's make sure that the topPosts subscription is ready and the posts are loaded
   if (this.data()) {
     Meteor.subscribe("page", this.data().widget.parent);
   };
   this.next();
 },
  data: function () {
    var widget = Widgets.findOne({_id: this.params._id});
    var schema = null;
    if(widget && Pages.findOne({_id: widget.parent})) {
      schema = Widgets.doSchema(widget.parent, widget.type);
    }
    return {widget:widget, schema:schema};
  },
  fastRender: true,
  where: 'client'
});

Router.route('form/edit/:_id/:widget', {
  title: 'Edit Form',
  name: 'updateForm',
  fastRender: true,
  where: 'client',
  waitOn: function() {
    return [
      Meteor.subscribe("widget", this.params.widget)
    ];
  },
  data: function () {
    var widget = Widgets.findOne({_id: this.params.widget});
    var form = null;
    var collection = null;
    if(widget) {
      Meteor.subscribe(widget.collectionName);
      collection = getCollection(widget.collectionName);
      form = collection.findOne({_id:this.params._id});
    }
    return {form:form, widget:widget, collection:collection};
  },
  before: function() {
   // let's make sure that the topPosts subscription is ready and the posts are loaded
   if (this.data()) {
     Meteor.subscribe("page", this.data().widget.parent);
   };
   this.next();
 },

});

Router.route('widget/insert/:parent', {
	parent: 'pagesList',
	title: 'Insert Widget',
  waitOn: function() {
    return[
      Meteor.subscribe("types"),
    Meteor.subscribe("page", this.params.parent)]
  },
  data: function () {
    var page = Pages.findOne({_id: this.params.parent});
    if(page) {
      var schema = Widgets.doSchema(this.params.parent);
      return page;
    }
  },
  name: 'insertWidget',
  fastRender: true,
  where: 'client'
});
