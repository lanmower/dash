Template.chats.created = function() {
  var instance = this;
  instance.toId = new ReactiveVar();

  instance.autorun(function() {
    var toId = Session.get('chat');
    instance.toId.set(toId);
  });
  instance.subscribe('messages');
};
Template.chats.helpers({
  chat: function () {
      var instance = Template.instance();
      var toId = instance.toId.get();
      if(!toId) return false;
      var userId = Meteor.userId();
      var messages = Messages.find(
        {
          $or:[
            {$and:[{createdBy: userId}, {to:{$in:[toId,"all"]}}]},
            {$and:[{createdBy: toId}, {to:{$in:[userId,"all"]}}]}
          ]
        },
        {sort: {createdAt: 1}, limit: 50});
      return {
        toId:toId,
        messages:messages
      };
    }
  })

Template.directChatMsg.helpers({
  self: function() {
    return Meteor.user();
  }
});
Template.directChatMsgRight.helpers({
  to: function() {
    return Meteor.users.findOne(Session.get('chat'));
  }
});
var sendBtnClick = function(value) {
  Messages.insert({"to":[Session.get('chat')], subject:"directChat", "body":value});
}
Template.directChat.events({
  "click .sendBtn" : function(event, template) {
    sendBtnClick(template.find("input").value);
  },
  "click .closeBtn" : function(event, template) {
    Session.set('chat', null);
  },
  'keypress input': function (evt, template) {
     if (evt.which === 13) {
       sendBtnClick(template.find("input").value);
     }
   }
 });
Template.directChat.helpers({
  messageOwner: function() {
    return this.createdBy == Meteor.userId();
  },
  messages: function() {
    return this.messages;
  },
  to: function() {
    return Meteor.users.findOne(Session.get('chat'));
  }

});
