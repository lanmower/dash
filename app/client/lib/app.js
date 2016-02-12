Accounts.ui.config(
  {
    requestOfflineToken: {google: true},
    forceApprovalPrompt: {google: true},
    loginStyle: 'redirect',
    requestPermissions:
    {google:
    ['https://www.googleapis.com/auth/userinfo.email',
      'https://apps-apis.google.com/a/feeds/emailsettings/2.0/',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/tasks',
      'https://mail.google.com/']
    }
});

ServiceConfiguration.configurations.update(
  {service: 'google'},
  {$set: {loginStyle: 'redirect'}}
);
/*userGeoLocation = new ReactiveVar(null);
Meteor.startup(function () {                                                                    // 36
  Hooks.init();
  Tracker.autorun(function (computation) {
    userGeoLocation.set(Geolocation.latLng());
    if (userGeoLocation.get()) {
      computation.stop();
    }
  });
});
*/
