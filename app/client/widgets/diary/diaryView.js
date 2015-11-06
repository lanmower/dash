Template.viewDiary.helpers({
  date: function() {
    return moment(Template.currentData().date).format("MMMM DD YYYY");
  }
});
