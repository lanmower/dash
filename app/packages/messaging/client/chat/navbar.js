Template.navbarMessages.helpers({
  msg: function () {
    var messages = Messages.find();
    return messages;
  },
  messageCount: function() {
    return Messages.find().count();
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
Template.navbarMessages.rendered = function(){
  this.subscribe("messages");
  this.open = false;
  this.autorun(function() {
    if(Template.navbarMessages.open == true) {
      setTimeout(function(){$('#navbarMessagesMenu').scrollTo('100%')},50);
    }
  });
}


Template.navbarMessages.events({
  "click .messageNotificationsTrigger": function() {
    var instance = this;
    $("#messageNotificationsTrigger").dropdown();
    console.log('test');
    if(Template.navbarMessages.open == false) {
      setTimeout(function(){$('#navbarMessagesMenu').scrollTo('100%')},50);
      instance.open = true;
      var messages = Messages.find().fetch();
      for(var x in messages) {
        var message = messages[x];
        if (message.read.indexOf(Meteor.user()._id) < 0) {
          var id = messages[x]._id;
          Messages.update({_id:id},{"$push":{'read':Meteor.user()._id}});
        }
      }
    } else {
      instance.open = false;
    }
  },
  "click .sendMessageLink": function() {
    Messages.insert({body:Template.instance().find('input').value, to:['all']});
  }
});
