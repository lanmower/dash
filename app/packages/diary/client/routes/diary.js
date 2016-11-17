Router.route('diary/view/:_id', {
  title: 'View Diary',
  name: 'viewDiary',
  fastRender: true,
  where: 'client',
  waitOn: function() {
    return [
      this.subscribe("diaries"),
    ];
  },
  data: function () {
    var diary = Diaries.findOne({_id:this.params._id});
    return {
      diary: diary
    };
  }
});
Router.route('diary/adminView/:_id', {
  title: 'Admin View Diary',
  name: 'adminViewDiary',
  template: 'viewDiary',
  fastRender: true,
  where: 'client',
  waitOn: function() {
    return [
      this.subscribe("diaries-admin"),
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
  name: 'diaryList',
  fastRender: true,
  where: 'client',
});

Router.route('diary/admin', {
  title: 'Diary Admin',
  name: 'diaryAdmin',
  fastRender: true,
  where: 'client',
});

Router.route('diary/today', {
  title: 'Todays Diary',
  name: 'diaryToday',
  fastRender: true,
  where: 'client',
  waitOn: function() {
    return [
      this.subscribe("diary")
    ];
  },
  data: function () {
    var diary = Diaries.findOne({_id:this.params._id});
    return {
      diary: diary
    };
  }
});
