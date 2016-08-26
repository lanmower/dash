//Meteor.widgetTypes.push({label:"Diary list", value:"diaryList"});
Template.diaryAdmin.onCreated( function() {
  var self = this;
  self.autorun(function() {
      self.subscribe('diaries-admin');
    }
  )
});

Template.diaryAdmin.helpers({
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
        key: 'user',
        label: 'User',
        fn: function (value, object, key) { 
          Template.instance().subscribe('user', value);
          let user = Meteor.users.findOne({_id:value});
          if(user) return user.profile.name;
          }
    }, 
        {
          key: 'buttons',
          label: '',
          tmpl: Template.DiaryAdminCellButtons, 
        }
    ]
  }
});
