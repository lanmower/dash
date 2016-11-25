var AdminLTEOptions = {
  directChat: {
    //Enable direct chat by default
    enable: true,
    //The button to open and close the chat contacts pane
    contactToggleSelector: '[data-widget="chat-pane-toggle"]'
  }
};
//test

Accounts.ui.config({
  forceApprovalPrompt: { google: true },
  requestOfflineToken: { google: true },
  requestPermissions: {
    google: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://apps-apis.google.com/a/feeds/emailsettings/2.0/',
    'https://www.googleapis.com/auth/admin.directory.user',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/tasks',
    'https://mail.google.com/']
  }
});

if (Meteor.isCordova){
  Meteor.startup(function () {
    Push.debug = true;

    Push.Configure({
      android: {
        senderID: 669341428356,
        alert: true,
        badge: true,
        sound: true,
        vibrate: true,
        clearNotifications: true
        // icon: '',
        // iconColor: ''
      },
      ios: {
        alert: true,
        badge: true,
        sound: true
      }
    });
  });
}

UI.registerHelper('isCordova', function(){
  if (Meteor.isCordova){
    return true;
  }
});
