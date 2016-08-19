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
  requestPermissions: {
    google: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://apps-apis.google.com/a/feeds/emailsettings/2.0/',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/tasks',
    'https://mail.google.com/']
  }
});
