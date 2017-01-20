Meteor.widgetTypes.push({
  label: "Diary view",
  value: "viewDiary"
});
Template.viewDiary.helpers({
  date: function() {
    if(this.diary) return moment(this.diary.date).format("MMMM DD YYYY");
  }
});
