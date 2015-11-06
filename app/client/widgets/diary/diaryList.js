Template.diaryList.onCreated( function() {
  var self = this;

  self.autorun(function() {
      self.subscribe('diaries');
    }
  )
});

Template.diaryList.helpers({
  diaries: function() {
    return Diaries.find();
  },
  date: function() {
    console.log('test');
    return moment(Template.currentData().date).format("MMMM DD YYYY");
  }
});
