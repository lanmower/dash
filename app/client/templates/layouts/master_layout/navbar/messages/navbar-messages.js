Template.navbarMessages.helpers({
  msg: function () {
    var messages = Messages.find().fetch();
    return messages;
  },
  messageCount: function() {
    var messages = Messages.find().fetch();
    var count = 0;
    for(var x in messages) {
      var message = messages[x];
      if (message.read.indexOf(Meteor.user()._id) < 0 && message.createdBy != Meteor.user()._id) {
        ++count
      }
    }
    return count;
  }
});
Template.navbarMessage.helpers({
  userImage: function (id) {
    console.log(id);
    var user = Meteor.users.findOne({_id:id});
    if(user) return user.profile.picture;
  },
});
Template.navbarMessages.onCreated(function () {
  Meteor.subscribe("messages");
  Meteor.subscribe("users");
});
Template.navbarMessages.open = false;
Template.navbarMessage.rendered = function(){
  this.autorun(function() {
    if(Template.navbarMessages.open == true) {
      setTimeout(function(){$('#navbarMessagesMenu').scrollTo('100%')},50);
    }
  });
}
Template.navbarMessages.viewmodel({
  message: '',
  checkMessages: function() {
    $("#messageNotificationsTrigger").dropdown();
    if(Template.navbarMessages.open == false) {
      setTimeout(function(){$('#navbarMessagesMenu').scrollTo('100%')},50);
      Template.navbarMessages.open = true;
      var messages = Messages.find().fetch();
      for(var x in messages) {
        var message = messages[x];
        if (message.read.indexOf(Meteor.user()._id) < 0) {
          var id = messages[x]._id;
          Messages.update({_id:id},{"$push":{'read':Meteor.user()._id}});
        }
      }
    } else {
      Template.navbarMessages.open = false;
    }
  },
  users: function() {
    var users = Meteor.users.find().fetch();
    var output = [];
    for(var x in users) {
      output.push(users[x].profile.name);
    }
    return output;
  },
  sendMessage: function() {
    Messages.insert({body:this.message(), to:['all']});
  }
});
