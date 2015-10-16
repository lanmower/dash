Accounts.ui.config({
    requestPermissions: {
        google:['https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/userinfo.profile'],
    },
    //forceApprovalPrompt: {google: true},
    requestOfflineToken: {google: true}
    //passwordSignupFields: 'EMAIL_ONLY',
    //extraSignupFields: []
});

userGeoLocation = new ReactiveVar(null);
Meteor.startup(function () {                                                                    // 36
  Hooks.init();
  Tracker.autorun(function (computation) {
    userGeoLocation.set(Geolocation.latLng());
    if (userGeoLocation.get()) {
      computation.stop();
    }
  });
});
