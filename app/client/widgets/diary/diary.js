Template.diary.helpers({
  diary: function() {
    var diary = Diaries.findOne({});
    return
  }
});
Template.diary.rendered = function() {
  var typingTimer;
  var doneTypingInterval = 2000;
  var diary;
  var doneTyping = function() {
    var user = Meteor.user();
    Meteor.users.update({_id:user._id}, {'$set':{"profile.diary":diary.toString()}});
  }

  var self = this;
  var tag = this.find('.diary');
  $(tag).summernote({
    oninit: function() {
       var ne = $('div.note-editable');
       var ned = $('div.note-editor');
       ned.css('position', 'absolute');
       ned.css('top', 0);
       ned.css('right', 0);
       ned.css('bottom', 0);
       ned.css('left', 0);
       ne.css('position', 'absolute');
       ne.css('top', 50);
       ne.css('right', 0);
       ne.css('bottom', 0);
       ne.css('left', 0);
    },
    onKeyup: function($editable, sHtml) {
      clearTimeout(typingTimer);
      diary = $(tag).code();
      typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }});
};
