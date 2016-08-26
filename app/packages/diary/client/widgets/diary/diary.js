Meteor.widgetTypes.push({label:"Diary", value:"diary"});
Template.diary.onRendered( function() {
  var self = this;
  const tag = self.find('.diary');
  self.tod = ReactiveVar(null);
  var done = false;
  self.subscribe('diaries');
  self.autorun(function() {
    	if (Template.instance().subscriptionsReady()) {
        $(tag).summernote('enable');
        if(!done) {
        if(self.tod.get()) {
          done = true;
          Template.diary.helpers({
            diary: function() {
              var diary = Diaries.findOne({_id:self.tod.get()}, {reactive:false});
              if(diary) return diary.diary;
            }
          });
          $(tag).summernote('code', Diaries.findOne({_id:self.tod.get()}, {reactive:false}).diary);
        }
        var ret = Diaries.findOne({user:Meteor.userId(), date:new Date().setHours(0,0,0,0)}, {reactive:false});
        if(ret) {
          self.tod.set(ret._id);
        }
      }
    } else {
      $(tag).summernote('disable');
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

  var tag = this.find('.diary');
  $(tag).summernote({
  callbacks: {
    onKeyup: _.debounce(function(event, template) {
      console.log('save');
      diary = $(tag).summernote('code');
      if(!self.tod.get()) {
        const diary = Diaries.insert({user:Meteor.userId(), date:new Date().setHours(0,0,0,0)});
        self.tod.set(diary);
      }
      Diaries.update({_id:self.tod.get()}, {'$set':{"diary":diary.toString()}});
    }, doneTypingInterval)
  }
})
};
