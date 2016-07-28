Template.navbarMessages.helpers({
  msg: function () {
    var messages = Messages.find();
    return messages;
  },
  messageCount: function() {
    return Messages.find({read:{$nin:[Meteor.userId()]}}).count();
  }
});
Template.navbarMessage.helpers({
  userImage: function (id) {
    var user = Meteor.users.findOne({_id:id});
    if(user && user.profile) return user.profile.picture;
  },
  userName: function (id) {
    var user = Meteor.users.findOne({_id:id});
    if(user && user.profile) return user.profile.name;
  },
});
Template.navbarMessages.created = function(){
  this.subscribe("messages");
}


Template.navbarMessages.events({
  "click .messageNotificationsTrigger": function() {
    var instance = this;
    $("#messageNotificationsTrigger").dropdown();
    if(instance.open != true) {
      instance.open = true;
      setTimeout(function(){$('#navbarMessagesMenu').scrollTop($('#navbarMessagesMenu')[0].scrollHeight)},50);
      var messages = Messages.find().forEach(function(message) {
        if (message.read.indexOf(Meteor.user()._id) < 0) {
          Messages.update({_id:message._id},{"$push":{'read':Meteor.user()._id}});
        }
      });
    } else {
      instance.open = false;
    }
  },
  "click .sendMessageLink": function() {
    Messages.insert({body:Template.instance().find('input').value, to:['all']});
  }
});
