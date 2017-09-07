/* global GoogleApi */
import Future from 'fibers/future';
var UserTransfer = new Mongo.Collection('usertransfer');
/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/
Meteor.googleApi = {};
const exchangeRefreshTokenAdmin = (userId) => {
  //if (!Roles.userIsInRole(this.userId, "admin")) return;
  var user;
  if (userId) {
    user = Meteor.users.findOne({
      _id: userId
    });
  }
  else {
    user = Meteor.user();
  }

  var config = Accounts.loginServiceConfiguration.findOne({
    service: "google"
  });
  if (!config)
    throw new Meteor.Error(500, "Google service not configured.");

  if (!user.services || !user.services.google || !user.services.google.refreshToken)
    throw new Meteor.Error(500, "Refresh token not found.");

  var result = Meteor.http.call("POST",
    "https://accounts.google.com/o/oauth2/token", {
      params: {
        'client_id': config.clientId,
        'client_secret': config.secret,
        'refresh_token': user.services.google.refreshToken,
        'grant_type': 'refresh_token'
      }
    });
  if (result.statusCode === 200) {
    Meteor.users.update(user._id, {
      '$set': {
        'services.google.accessToken': result.data.access_token,
        'services.google.expiresAt': (+new Date) + (1000 * result.data.expires_in),
      }
    });
    console.log('update token done');

    return result.data;
  }
  else {
    throw new Meteor.Error(result.statusCode, 'Unable to exchange google refresh token.', result);
  }
};

Meteor.googleApi.get = (user, uri) => {
  try {
    return GoogleApi.get(uri, {
      user: user
    });
  }
  catch (e) {
    if (e.error == 403 && e.reason == 'Must be signed in to use Google API.') {
      exchangeRefreshTokenAdmin(user._id);
      user = Meteor.users.findOne(user._id);
      return GoogleApi.get(uri, {
        user: user
      });
    }
    console.log(e);
  }
}

Meteor.googleApi.put = (user, uri, data) => {
  try {
    return GoogleApi.put(uri, {
      user: user,
      data: data
    });
  }
  catch (e) {
    if (e.error == 403 && e.reason == 'Must be signed in to use Google API.') {
      exchangeRefreshTokenAdmin(user._id);
      user = Meteor.users.findOne(user._id);
      return GoogleApi.put(uri, {
        user: user,
        data: data
      });
    }
    console.log(e);
  }
}

Meteor.methods({
  'usertransfer': function(_id) {
    if (!Roles.userIsInRole(this.userId, "admin")) return;
    let user = Meteor.users.findOne(_id);
    let email = user.profile.email;
    if (user && user._id) {
      Meteor.call("changePw", user._id);
    }
    let exec = Npm.require('child_process').exec;
    let spawn = Npm.require('child_process').spawn;
    var future = new Future();
    exec("chmod +x /bundle/bundle/programs/web.browser/app/imapsync", function(error, stdout, stderr) {
      console.log('imapsync permissions are set');
    });
    exec("chmod +x /bundle/bundle/programs/web.browser/app/usertransfer", function(error, stdout, stderr) {
      console.log('usertransfer permissions are set');
    });

    var id = UserTransfer.insert({
      email: email,
      stdout: [],
      stderr: []
    });
    const ls = spawn("/bundle/bundle/programs/web.browser/app/usertransfer", [email]);
    let code, stderr = '',
      stdout = '';
    ls.stdout.on('data', Meteor.bindEnvironment((data) => {
      if (id) {
        UserTransfer.update(id, {
          $push: {
            stdout: data.toString(),
          }
        });
      }
      console.log(data.toString());
    }));

    ls.stderr.on('data', Meteor.bindEnvironment((data) => {
      if (id) {
        UserTransfer.update(id, {
          $push: {
            stderr: data.toString(),
          }
        });
      }
      console.log(data.toString());
    }));

    ls.on('close', Meteor.bindEnvironment((code) => {
      UserTransfer.update(id, {
        $set: {
          code: code
        }
      });
      future.return({
        code,
      });
      const failed = code == 111 ? 'done' : 'failed';
      Email.send({
        to: Meteor.user().profile.email,
        from: 'admin@coas.co.za',
        subject: "User transfer " + failed + ".",
        text: "User Transfer " + failed + " for: " + user.profile.email + " exit code was:" + code + " Output was:" + UserTransfer.findOne(id).stdout,
        html: "<pre>User Transfer " + failed + " for: " + user.profile.email + " exit code was:" + code + " Output was:" + UserTransfer.findOne(id).stdout + "</pre>",
      });
    }));

    return future.wait();
  },
  listUsers: function() {
    var options = {};
    var imageUrl = "";
    var adminUser = Meteor.users.findOne({
      "profile.name": "ADMIN"
    });
    var uri = "admin/directory/v1/users?domain=coas.co.za";

    if (!Roles.userIsInRole(this.userId, "admin")) return;

    console.log('listing users');
    return Meteor.googleApi.get(adminUser, uri);
  },
  downloadAvatar: function(userId) {
    this.unblock();
    DownloadAvatar(userId);
  },
  changePw: function(_id, pw) {
    if (!Roles.userIsInRole(this.userId, "admin")) return;
    var password = pw ? pw : "123!Slam";
    var user = Meteor.users.findOne({
      _id: _id
    });
    var alias = user.profile.email;
    var adminUser = Meteor.users.findOne({
      "profile.name": "ADMIN"
    });
    var uri = "admin/directory/v1/users/" + alias;

    return Meteor.googleApi.put(adminUser, uri, {
      "password": password
    });
  },
  changeAllPw: function() {
    if (!Roles.userIsInRole(this.userId, "admin")) return;
    var response = {};
    Meteor.users.find().forEach(function(user) {
      var alias = user.profile.email;
      if (user && user.services && user.services.google && user.profile.name != 'ADMIN') {

        var options = {};
        var adminUser = Meteor.users.findOne({
          "profile.name": "ADMIN"
        });
        var uri = "admin/directory/v1/users/" + alias;

        options.headers = options.headers || {
          "Content-Type": "application/atom+xml"
        };
        options.headers.Authorization = 'Bearer ' + adminUser.services.google.accessToken;
        options.data = {
          "changePasswordAtNextLogin": true
        };
        response[alias] = Meteor.googleApi.put(adminUser, uri, {
          "changePasswordAtNextLogin": true
        });
        console.log(response[alias]);
      }
      else {
        response[alias] = "No google account";
      }
      return response;
    });
  }

});
