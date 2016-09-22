import Future from 'fibers/future';
/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

Meteor.methods({
  'command' : function(line) {
    exec = Npm.require('child_process').exec;
    console.log("In command method", line);
    var Fiber = Meteor.npmRequire('fibers');
    exec(line, function(error, stdout, stderr) {
      console.log('Command Method', error, stdout, stderr);
      Fiber(function() {
        //Replies.remove({});
        //var replyId = Replies.insert({message: stdout ? stdout : stderr});
        //return replyId;
      }).run();
    });
  },
  exchangeRefreshTokenAdmin: function(userId) {
      this.unblock();
      if(Roles.userIsInRole(this.userId, "admin")) {

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
      
      try {
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
      } catch (e) {
        var code = e.response ? e.response.statusCode : 500;
        throw new Meteor.Error(code, 'Unable to exchange google refresh token.', e.response)
      }
      
      if (result.statusCode === 200) {
        // console.log('success');
        // console.log(EJSON.stringify(result.data));

        Meteor.users.update(user._id, { 
          '$set': { 
            'services.google.accessToken': result.data.access_token,
            'services.google.expiresAt': (+new Date) + (1000 * result.data.expires_in),
          }
        });

        return result.data;
      } else {
        throw new Meteor.Error(result.statusCode, 'Unable to exchange google refresh token.', result);
      }
    }
  },
  downloadAvatar: function(userId) {
    console.log("Downloading avatar for:"+userId);
    this.unblock();
    DownloadAvatar(userId);
  },
  setSignature: function(_id) {
    var future = new Future();
    user = Meteor.users.findOne({_id:_id});
    alias = user.profile.email.split("@")[0];
    domain = user.profile.email.split("@")[1];
    if (user && user.services && user.services.google &&
      Meteor.user().services.google.accessToken) {
        var options = {};
        var imageUrl ="";
        var adminUser = Meteor.users.findOne({"profile.name":"ADMIN"});
        if(Files.findOne({_id:user.profile.picture})) imageUrl = Files.findOne({_id:user.profile.picture}).url();
        fields = {'fullName' : user.profile.name, 'titles':user.profile.titles, 'primaryEmail' : user.profile.email, 'roles' : user.profile.roles,'phone' :user.profile.phone?('<img src="'+Meteor.absoluteUrl()+'/email_signature_assets/header-mobile-icon.jpg" align="left" border="0">')+user.profile.phone:'','image' :Meteor.absoluteUrl().substring(0, Meteor.absoluteUrl().length - 1)+imageUrl};
        var signature = _.template(user.profile.signature)(fields);
        options.headers = options.headers || {"Content-Type":"application/atom+xml"};
        options.headers.Authorization = 'Bearer ' + adminUser.services.google.accessToken;
        options.content = '<?xml version="1.0" encoding="utf-8"?><atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:apps="http://schemas.google.com/apps/2006"><apps:property name="signature" value="'+signature.EncodeXMLEscapeChars()+'" /></atom:entry>';
        //options.data = {signature:"test"};

        Meteor.http.call("PUT", "https://apps-apis.google.com/a/feeds/emailsettings/2.0/"+domain+"/"+alias+"/signature", options, function( error, response ) {
          if ( error ) {
            Meteor.call("exchangeRefreshTokenAdmin", adminUser._id);
            var adminUser = Meteor.users.findOne({"profile.name":"ADMIN"});
            options.headers.Authorization = 'Bearer ' + adminUser.services.google.accessToken;
            Meteor.http.call("PUT", "https://apps-apis.google.com/a/feeds/emailsettings/2.0/"+domain+"/"+alias+"/signature", options, function( errortwo, response ) {
              if ( errortwo ) {
                future.return( errortwo );
              } else {
                future.return( "Refresh token exchanged" );
              }
            });
          } else {
            future.return( true );
          }
        });
      } else {
        callback(new Meteor.Error(403, "Auth token not found. Connect your google account"));
      }
      return future.wait();
    }


});
