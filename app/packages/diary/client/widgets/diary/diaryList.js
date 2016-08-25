Meteor.widgetTypes.push({label:"Diary list", value:"diaryList"});
Template.diaryList.onCreated( function() {
  var self = this;
console.log('trace');
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
        fn: function (value, object, key) { 
            return moment(value).format("MMMM DD YYYY");
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


{ fields: [
    {
        key: 'resources',
        label: 'Number of Resources',
        fn: function (value, object, key) { return value.length; }
    }
] }
