Router.route('diary/view/:_id', {
  title: 'View Diary',
  name: 'viewDiary',
  fastRender: true,
  where: 'client',
  waitOn: function() {
    return [
      this.subscribe("diaries")
    ];
  },
  data: function () {
    var diary = Diaries.findOne({_id:this.params._id});
    return {
      diary: diary
    };
  }
});
Router.route('diary/today', {
  title: 'Todays Diary',
  name: 'diaryToday',
  fastRender: true,
  where: 'client',
  waitOn: function() {
    return [
      this.subscribe("diaries")
    ];
  },
  data: function () {
    var diary = Diaries.findOne({_id:this.params._id});
    return {
      diary: diary
    };
  }
});
