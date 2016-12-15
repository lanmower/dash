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
