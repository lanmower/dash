import Future from 'fibers/future';
/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

Meteor.methods({
  'command' : function(line) {
    exec = Npm.require('child_process').exec;
    console.log("In command method", line);
    var future = new Future();
    exec(line, function(error, stdout, stderr) {
      console.log('Command Method', error, stdout, stderr);
      future.return({error, stdout, stderr});
    });
      return future.wait();
  },
  exchangeRefreshTokenAdmin: function(userId) {
    if(!Roles.userIsInRole(this.userId, "admin")) return;

    var user;
    if (userId && Meteor.isServer) {
      user = Meteor.users.findOne({_id: userId});
    } else {
      user = Meteor.user();
    }

    var config = Accounts.loginServiceConfiguration.findOne({service: "google"});
    if (! config)
      throw new Meteor.Error(500, "Google service not configured.");

    if (! user.services || ! user.services.google || ! user.services.google.refreshToken)
      throw new Meteor.Error(500, "Refresh token not found.");
    var result = Meteor.http.call("POST",
      "https://accounts.google.com/o/oauth2/token",
      {
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
    } else {
      throw new Meteor.Error(result.statusCode, 'Unable to exchange google refresh token.', result);
    }
  },
  downloadAvatar: function(userId) {
    this.unblock();
    DownloadAvatar(userId);
  },
  changePw: function(_id) {
    user = Meteor.users.findOne({_id:_id});
    alias = user.profile.email//.split("@")[0];
    //domain = user.profile.email.split("@")[1];
    if (user && user.services && user.services.google &&
      Meteor.user().services.google.accessToken) {
        var options = {};
        var imageUrl ="";
        var adminUser = Meteor.users.findOne({"profile.name":"ADMIN"});
        var uri = "admin/directory/v1/users/"+alias;

        options.headers = options.headers || {"Content-Type":"application/atom+xml"};
        options.headers.Authorization = 'Bearer ' + adminUser.services.google.accessToken;
        response = GoogleApi.put(uri, {user:adminUser, data:{"changePasswordAtNextLogin":true}});
        return response;
      } else {
        callback(new Meteor.Error(403, "Auth token not found. Connect your google account"));
      }
    },
  changeAllPw: function() {
    var response = {};
    Meteor.users.find().forEach(function(user) {
      try {
        alias = user.profile.email;
        if (user && user.services && user.services.google && user.profile.name != 'ADMIN') {

            var options = {};
            var imageUrl ="";
            var adminUser = Meteor.users.findOne({"profile.name":"ADMIN"});
            var uri = "admin/directory/v1/users/"+alias;

            options.headers = options.headers || {"Content-Type":"application/atom+xml"};
            options.headers.Authorization = 'Bearer ' + adminUser.services.google.accessToken;
            options.data = {"changePasswordAtNextLogin":true};
            response[alias] = GoogleApi.put(uri, {user:adminUser, data:{"changePasswordAtNextLogin":true}});
            console.log(response[alias]);
          } else {
            response[alias] = "No google account";
          }
        return response;
      } catch (e) {
        console.log(e);
      }
    });
  }

});
