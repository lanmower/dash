//Meteor.widgetTypes.push({label:"Diary list", value:"diaryList"});
Template.diaryAdmin.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('diaries-admin');
  })
});

Template.diaryAdmin.helpers({
  col: function() {
    return 'diaries';
  },
  fields: function() {
    return [{
        key: 'date',
        label: 'Date',
        sortByValue: true,
        fn: function(value, object, key) {
          return moment(value).format("MMMM DD YYYY");
        }
      }, {
        key: 'user',
        label: 'User',
        fn: function(value, object, key) {
          let user = Meteor.users.findOne({
            _id: value
          });
          if (user) return user.profile.name;
        }
      }, {
        key: 'diary',
        label: 'Diary',
        hidden: true,
        fn: function(value, object, key) {
          return new Spacebars.SafeString(value);
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
