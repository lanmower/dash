Meteor.widgetTypes.push({
  label: "Diary view",
  value: "viewDiary"
});
Template.viewDiary.helpers({
  date: function() {
    console.log(this);
    return moment(this.diary.date).format("MMMM DD YYYY");
  }
});
