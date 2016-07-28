Meteor.publish('gmailMsg', function(id) {
  return gmail.find({_id:id});
});

Meteor.publish('gmailSearch', function(uid, q) {
  return [gmailSearch.find({user:uid, query:q}), gmail.find({user:uid, query:q})];
});
