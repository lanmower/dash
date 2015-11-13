Template.viewDiary.helpers({
  date: function() {
    return moment(this.diary.date).format("MMMM DD YYYY");
  }
});
