/*global Router, Push, util*/
import Fiber from 'fibers';

var Uptime = new Mongo.Collection('uptime');

var up = {

}
var times = {

}

setInterval(function() {
  Fiber(() => {
    for (const ip in up) {
      if (new Date() - times[ip] > 86400000) { //stop tracking after 1 day
        delete up[ip];
        delete times[ip]
        if (Uptime.findOne(up[ip])) {
          Uptime.update(up[ip], {
            stoppedAt: new Date()
          });
        }
      }
      if (new Date() - times[ip] > 20000) {
        //log downtime
        if (up[ip] == true) {
          console.log('inserting');
          up[ip] = Uptime.insert({
            IP: ip,
            time: new Date()
          });
        }
        else {
          console.log('updating');
          if (Uptime.findOne(up[ip])) {
            Uptime.update(up[ip], {
              until: new Date()
            });
          }
        }
      }
    }
  }).run();
}, 10000);

Router.route('/monitor', function() {
  this.response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  const ip = this.request.headers['x-forwarded-for'];
  this.response.end('<html><body><pre>' + ip + '</pre></body></html>');
  if (up[ip] != true && Uptime.findOne(up[ip])) {
    Uptime.update(up[ip], {
      until: new Date()
    });
  }
  up[ip] = true;
  times[ip] = new Date();
}, {
  where: 'server'
});

Meteor.startup(function() {
  //Push.debug = true;
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
