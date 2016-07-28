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
        if(Files.findOne({_id:user.profile.picture})) imageUrl = Files.findOne({_id:user.profile.picture}).url();
        fields = {'fullName' : user.profile.name, 'titles':user.profile.titles, 'primaryEmail' : user.profile.email, 'roles' : user.profile.roles,'phone' :user.profile.phone?('<img src="'+Meteor.absoluteUrl()+'/email_signature_assets/header-mobile-icon.jpg" align="left" border="0">')+user.profile.phone:'','image' :Meteor.absoluteUrl().substring(0, Meteor.absoluteUrl().length - 1)+imageUrl};
        var signature = _.template(user.profile.signature)(fields);
        options.headers = options.headers || {"Content-Type":"application/atom+xml"};
        options.headers.Authorization = 'Bearer ' + Meteor.user().services.google.accessToken;
        options.content = '<?xml version="1.0" encoding="utf-8"?><atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:apps="http://schemas.google.com/apps/2006"><apps:property name="signature" value="'+signature.EncodeXMLEscapeChars()+'" /></atom:entry>';
        //options.data = {signature:"test"};

        Meteor.http.call("PUT", "https://apps-apis.google.com/a/feeds/emailsettings/2.0/"+domain+"/"+alias+"/signature", options, function( error, response ) {
          if ( error ) {
            future.return( error );
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
