Template.MasterLayout.helpers({
  pageTitle:function() {
    if(!Meteor.pageTitle) Meteor.pageTitle = new ReactiveVar();
    return Meteor.pageTitle.get();
  }
});
