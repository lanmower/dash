import { Meteor } from 'meteor/meteor';


var searchQuery = null;

if(Meteor.isClient) {
  Template.submissionsCalendar.created = function () {
    var instance = this;
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

  Template.submissionsCalendar.helpers({
    options: function() {
      var name = this.collectionName;
      var events  = [];
      console.log(this);
      var collection = getCollection(name).find({}).forEach(function(item) {
        events.push({
          //title:
          //start:
          //end:
        });

      });

      return {
           eventLimit: true, // allow "more" link when too many events
           events : list
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
      if(Roles.userIsInRole(Meteor.userId(), this.collectionName+"-admin")) return true;
      return false;
    },
    label: function() {
      return this['title'];
    }
  });
}
