/*****************************************************************************/
Template.UsersList.helpers({
  code: function(_id) {
    Math.seedrandom(_id);
    return "" + parseInt(Math.random() * 10) + parseInt(Math.random() * 10) + parseInt(Math.random() * 10) + parseInt(Math.random() * 10);
  }
});
Template.UsersList.events({
  "click .chat": function() {
    Session.set('chat', this._id);
  }
});
