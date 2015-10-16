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
