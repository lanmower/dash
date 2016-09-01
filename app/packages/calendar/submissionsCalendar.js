import { Meteor } from 'meteor/meteor';


var searchQuery = null;

if(Meteor.isClient) {
  Template.submissionsCalendar.created = function () {
    var instance = this;
    instance.fc = new ReactiveVar();
    instance.searchQuery = new ReactiveVar(null);

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

  Template.submissionsCalendar.rendered = function () {
    var instance = this;
    this.autorun(function () {
      Router.current().data().collection.find();
      if(instance.fc.get()) instance.fc.get().fullCalendar('refetchEvents');
    });
    instance.fc.set(instance.$('.fc'));
  };

  Template.submissionsCalendar.helpers({
    events: function() {
      var instance = Template.instance();
      var data = this;
      return function (start, end, tz, callback) {
          var events = [];
          data.fields.forEach(function(field) {
            if(field.type == 'dateRangeInput') {
              data.collection.find().forEach(function (doc) {
                     events.push({
                      title: Meteor.users.findOne(doc.createdBy).profile.name,
                      start: doc[field.name+"Start"],
                      end: doc[field.name+"End"],
                    });
                  });
            };
          });
          callback(events);
      };
    },
    currentForm: function() {
      return Router.current().params.form;
    },
    items: function() {
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
}
