Template.messageList.events({
  "click .contactButton" : function(event, template) {
    Session.set('chat',this._id);
  }
});


Template.messageList.helpers({
   userImage: function (id) {
    var user = Meteor.users.findOne({_id:id});
    if(user && user.profile) return user.profile.picture;
  },
    lastmessage: function(_id) {
    const userId = Meteor.userId();
    const toId = _id;
    const message = Messages.findOne({
          $or:[
            {$and:[{createdBy: userId}, {to:{$in:[toId,"all"]}}]},
            {$and:[{createdBy: toId}, {to:{$in:[userId,"all"]}}]}
          ]
        },
        {sort: {createdAt: -1}});
    return message;
  },
  users: function() {
    return Meteor.users.find();
  }

});

