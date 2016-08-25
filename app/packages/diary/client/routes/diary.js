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

Router.route('diary/list', {
  title: 'Diary List',
  name: 'listDiary',
  fastRender: true,
  where: 'client',
});

Router.route('diary/today', {
  title: 'Todays Diary',
  name: 'todayDiary',
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
