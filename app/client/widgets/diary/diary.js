Template.diary.onCreated( function() {
  var self = this;
  self.tod = ReactiveVar(null);

  self.autorun(function() {
      self.subscribe('diaries');
    	if (Template.instance().subscriptionsReady()) {
        if(self.tod.get()) {
          Template.diary.helpers({
            diary: function() {
              var diary = Diaries.findOne({_id:self.tod.get()})
              if(diary) return diary.diary;
            }
          });
          Tracker.autorun(function () {
            var tag = self.find('.diary');
            if(self.tod.get()) $(tag).code(Diaries.findOne({_id:self.tod.get()}).diary);
          });
        }
        var ret = Diaries.findOne({user:Meteor.userId(), date:new Date().setHours(0,0,0,0)});
        if(!ret) {
          console.log('inserting diary');
          var diary = Diaries.insert({user:Meteor.userId(), date:new Date().setHours(0,0,0,0)});
          self.tod.set(diary);
        }
        else {
          console.log('setting diary');
          self.tod.set(ret._id);
        }
      }
    }
  )
});

Template.diary.destroyed = function() {
  var tag = this.find('.diary');
  $(tag).destroy();
}
Template.diary.rendered = function() {
  var self = Template.instance();
  var typingTimer;
  var doneTypingInterval = 1000;
  var diary;
  if(Meteor.diarySelection) rangy.restoreSelection(Meteor.diarySelection);
  var doneTyping = function() {
    console.log(self.tod.get());
    Diaries.update({_id:self.tod.get()}, {'$set':{"diary":diary.toString()}});
    Meteor.diarySelection = rangy.saveSelection();
    console.log('typed');
  }

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
