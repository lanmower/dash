Meteor.widgetTypes.push({label:"Media Search", value:"mediaSearch"});
Template.mediaSearch.helpers({
  forms: function() {
    var name = "posts";
    var collection = getCollection(name);
    if(Session.get("searchQuery")) return collection.find({});
    else return collection.find({});
  }
});

var searchQuery = null;
Template.mediaSearch.events({
  "submit .form": function(event) {
    return false;
  },
  'keyup .form input': _.debounce(function(event, template) {
    event.preventDefault();
    Session.set('searchQuery', template.find('.form input').value);
    if(searchQuery) searchQuery.stop();
    searchQuery = this.subscribe('formSearch', "6vFSoRFbXZJufbMPi", Session.get('searchQuery'));
  }, 300)
});
