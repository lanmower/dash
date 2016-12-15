
Meteor.publish('signatures', function () {
  return Signatures.find();
});

Meteor.publish('signature', function (id) {
  return Signatures.find({_id: id});
});
