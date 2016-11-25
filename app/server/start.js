Meteor.startup(function () {
  Push.debug = true;
  Push.Configure({
  /*apn: {
    certData: Assets.getText('apnDevCert.pem'),
    keyData: Assets.getText('apnDevKey.pem'),
    passphrase: 'xxxxxxxxx',
    production: true,
    //gateway: 'gateway.push.apple.com',
  },*/
  gcm: {
    apiKey: 'AIzaSyC5H1T_OnDBz14RMpXJBYDjKRlmJn7f_Pg'
    //"projectNumber": "669341428356"
  },
    "production": true,
    "badge": true,
    "sound": true,
    "alert": true,
    "vibrate": true
  // 'sendInterval': 15000, Configurable interval between sending
  // 'sendBatchSize': 1, Configurable number of notifications to send per batch
  // 'keepNotifications': false,
  //
  });
});

Push.allow({
    send: function(userId, notification) {
        console.log('allowing push');
        return true; // Allow all users to send
    }
});

// Or...
Push.deny({
    send: function(userId, notification) {
        console.log('allowing push');
        return false; // Allow all users to send
    }
});
