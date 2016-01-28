Meteor.widgetTypes.push({label:"Diary", value:"diary"});
Template.diary.onCreated( function() {
  var self = this;
  self.tod = ReactiveVar(null);
  var done = false;
  self.subscribe('diaries');
  self.autorun(function() {
    	if (Template.instance().subscriptionsReady()) {
        if(!done) {
        if(self.tod.get()) {
          done = true;
          Template.diary.helpers({
            diary: function() {
              var diary = Diaries.findOne({_id:self.tod.get()}, {reactive:false});
              if(diary) return diary.diary;
            }
          });
          var tag = self.find('.diary');
          $(tag).code(Diaries.findOne({_id:self.tod.get()}, {reactive:false}).diary);
        }
        var ret = Diaries.findOne({user:Meteor.userId(), date:new Date().setHours(0,0,0,0)}, {reactive:false});
        if(!ret) {
          var diary = Diaries.insert({user:Meteor.userId(), date:new Date().setHours(0,0,0,0)});
          self.tod.set(diary);
        }
        else {
          self.tod.set(ret._id);
        }
      }
    }
  })
});

Template.diary.destroyed = function() {
  var tag = this.find('.diary');
  $(tag).summernote("destroy");
}

Template.diary.rendered = function() {
  var self = Template.instance();
  var typingTimer;
  var doneTypingInterval = 1000;
  var diary;

  console.log('test');
  var tag = this.find('.diary');
  console.log(tag);
  $(tag).summernote({
  callbacks: {
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
       console.log("test");
    },
    onKeyup: _.debounce(function(event, template) {
      diary = $(tag).code();
      Diaries.update({_id:self.tod.get()}, {'$set':{"diary":diary.toString()}});
    }, doneTypingInterval)
  }
})
};
