
Template.diary.onCreated( function() {
  var self = this;
  self.tod = ReactiveVar(null);
  self.autorun(function() {
    self.subscribe('diaries');
    	if (Template.instance().subscriptionsReady() && self.tod.get()) {
        Template.diary.helpers({
          diary: function() {
            return Diaries.findOne({_id:self.tod.get()}).diary;
          }
        });
        Tracker.autorun(function () {
          var tag = self.find('.diary');
          console.log(self.tod.get());
          if(self.tod.get()) $(tag).code(Diaries.findOne({_id:self.tod.get()}).diary);
        });

        var userId = Meteor.userId();
        var ret = Diaries.findOne({user:userId, date:new Date().setHours(0,0,0,0)});
        if(!ret) self.tod.set( Diaries.insert({user:userId, date:new Date().setHours(0,0,0,0)}));
        else self.tod.set(ret._id);
      }
    }
  )
});

Template.diary.destroyed = function() {
  var tag = this.find('.diary');
  $(tag).destroy();
}
Template.diary.rendered = function() {
  var typingTimer;
  var doneTypingInterval = 2000;
  var diary;
  var doneTyping = function() {
    Diaries.update({_id:self.tod.get()}, {'$set':{"diary":diary.toString()}});
  }

  var self = Template.instance();
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
    }})
};
