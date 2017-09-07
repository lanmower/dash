/*global Router, Push, util*/
import Fiber from 'fibers';

var Uptime = new Mongo.Collection('uptime');

var ids = {}

Router.route('/monitor/:name', function() {
  var name = this.params.name;
  const ip = this.request.connection.remoteAddress;
  Fiber(() => {
    this.response.writeHead(200, {
      'Content-Type': 'text/html'
    });

    if (!ids[name]) {
      ids[name] = Uptime.insert({
        ip: ip,
        from: new Date()
      });
    } else {
      const uptime = Uptime.findOne(ids[name]);
      if (uptime && uptime.till && new Date() - uptime.till > 60000) { //1 minute downtime
        ids[name] = Uptime.insert({
          ip: ip,
          from: new Date(),
          name: name
        });
      } else {
        Uptime.update(ids[name], {
          till: new Date(),
          ip: uptime.ip,
          from: uptime.from,
          uptime: new Date() - uptime.from
        });
      }
    }
  }).run();
  this.response.end(ip);
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
