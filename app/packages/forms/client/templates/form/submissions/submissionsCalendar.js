var searchQuery = null;

Template.submissionsCalendar.created = function () {
  var instance = this;
  instance.schema = new ReactiveVar(null);
  instance.searchQuery = new ReactiveVar(null);

  instance.autorun(function () {
    if(Template.currentData()) {
      //this.subscribe(Template.currentData().form._id);
      instance.schema.set(listSchema(Template.currentData()));
    }
  });

  instance.autorun(function(){
    searchQuery = instance.subscribe('formSearch', Router.current().params.form, instance.searchQuery.get());
  });
};

Template.submissionsCalendar.events({
  "submit .form": function(event) {
    return false;
  },
  'keyup .form input': _.debounce(function(event, template) {
    event.preventDefault();
    template.searchQuery.set(template.find('.form input').value)
  }, 300)
});

Template.submissionsCalendar.helpers({
  currentForm: function() {
    return Router.current().params.form;
  },
  items: function() {
    var collection = getCollection(this.formId);
    return collection.find({});
  },
  searchQuery: function() {
    return Template.instance().searchQuery.get();
  },
  canAdmin: function() {
    if(Roles.userIsInRole(Meteor.userId(), "admin")) return true;
    if(Roles.userIsInRole(Meteor.userId(), this.formId+"-admin")) return true;
    return false;
  },
  label: function() {
    return this['title'];
  }
});
