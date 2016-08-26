//Meteor.widgetTypes.push({label:"Diary list", value:"diaryList"});
Template.diaryList.onCreated( function() {
  var self = this;
  self.autorun(function() {
      self.subscribe('diaries');
    }
  )
});

Template.diaryList.helpers({
  col: function() {
    return Diaries.find();
  },
  fields: function() {
    return [
      {
        key: 'date',
        label: 'Date',
        sortByValue: true,
        fn: function (value, object, key) { 
            return moment(value).format("MMMM DD YYYY");
          }
    }, 
    {
        key: 'diary',
        label: 'Diary',
        fn: function (value, object, key) { 
            return new Spacebars.SafeString(value);
          }
    },
        {
          key: 'buttons',
          label: '',
          tmpl: Template.DiaryListCellButtons,
          
        }
    ]
  }
});
