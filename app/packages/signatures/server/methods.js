import Future from 'fibers/future';

function setSignature(userId, template) {
    const user = Meteor.users.findOne({_id:userId});
    const adminUser = Meteor.users.findOne({"profile.name":"ADMIN"});
    const alias = user.profile.email.split("@")[0];
    const domain = user.profile.email.split("@")[1];
    if (user && user.services && user.services.google &&
      Meteor.user().services.google.accessToken) {
        const options = {};
        let imageUrl ="";
        if(Files.findOne({_id:user.profile.picture})) imageUrl = Files.findOne({_id:user.profile.picture}).url();
        let fields = {'fullName' : user.profile.name, 'titles':user.profile.titles, 'primaryEmail' : user.profile.email, 'roles' : user.profile.roles,'phone' :user.profile.phone?('<img src="'+Meteor.absoluteUrl()+'/email_signature_assets/header-mobile-icon.jpg" align="left" border="0">')+user.profile.phone:'','image' :Meteor.absoluteUrl().substring(0, Meteor.absoluteUrl().length - 1)+imageUrl};
        let signature = _.template(template)(fields);
        options.headers = options.headers || {"Content-Type":"application/atom+xml"};
        options.headers.Authorization = 'Bearer ' + adminUser.services.google.accessToken;
        options.content = '<?xml version="1.0" encoding="utf-8"?><atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:apps="http://schemas.google.com/apps/2006"><apps:property name="signature" value="'+signature.EncodeXMLEscapeChars()+'" /></atom:entry>';
        //options.data = {signature:"test"};
        let result = {};
        try {
          result = Meteor.http.call("PUT", "https://apps-apis.google.com/a/feeds/emailsettings/2.0/"+domain+"/"+alias+"/signature", options);
        } catch (e) {
          if(e.response.statusCode == 401) {
            let adminUser = Meteor.users.findOne({"profile.name":"ADMIN"});
            const newAuth = Meteor.call("exchangeRefreshTokenAdmin", adminUser._id);
            console.log(newAuth);
            options.headers.Authorization = 'Bearer ' + newAuth.access_token;
            result = Meteor.http.call("PUT", "https://apps-apis.google.com/a/feeds/emailsettings/2.0/"+domain+"/"+alias+"/signature", options);
            if(result.statusCode != 200) {
              return {message:"After token exchange, still error:", response: result};
            }
          } else {
            result = e;
          }
        }
        if(result.statusCode == 200) {
          Meteor.users.update(userId, { 
              '$set': { 
                'profile.signatureSet': new Date,
              }
            });
        } else {
          Meteor.users.update(userId, { 
              '$set': { 
                'profile.signatureSet': null,
              }
            });
        }
      return result;
    }
};

Meteor.methods({
  invalidateToken: function(userId) {
    if(!Roles.userIsInRole(this.userId, "admin")) return;
    Meteor.users.update(userId, { 
        '$set': { 
          'services.google.accessToken': '1234567890',
          'services.google.expiresAt': (+new Date) + (1000 * 10),
        }
      });
    
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
  setSignature: function(_id) {
    const signature = Signatures.findOne(_id);
    const template = signature.signature;
    const results = {};
    _.each(signature.users, function(userId) {
      results[userId] = setSignature(userId, template);
    });
    return results;

    }
});