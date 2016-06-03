String.prototype.EncodeXMLEscapeChars = function () {
  var OutPut = this;
  if (OutPut.trim() != "") {
    OutPut = OutPut.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    OutPut = OutPut.replace(/&(?!(amp;)|(lt;)|(gt;)|(quot;)|(#39;)|(apos;))/g, "&amp;");
    OutPut = OutPut.replace(/([^\\])((\\\\)*)\\(?![\\/{])/g, "$1\\\\$2");  //replaces odd backslash(\\) with even.
  }
  else {
    OutPut = "";
  }
  return OutPut;
};

decodeRawData = function(body){
  if(body)
  return (new Buffer(body.replace(/-/g, '+').replace(/_/g, '/'), "base64")).toString();
};
var toQueryString = function(obj) {
  return _.map(obj,function(v,k){
    return encodeURIComponent(k) + '=' + encodeURIComponent(v);
  }).join('&');
};
import Future from 'fibers/future';
/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/
String.prototype.EncodeXMLEscapeChars = function () {
  var OutPut = this;
  if (OutPut.trim() != "") {
    OutPut = OutPut.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    OutPut = OutPut.replace(/&(?!(amp;)|(lt;)|(gt;)|(quot;)|(#39;)|(apos;))/g, "&amp;");
    OutPut = OutPut.replace(/([^\\])((\\\\)*)\\(?![\\/{])/g, "$1\\\\$2");  //replaces odd backslash(\\) with even.
  }
  else {
    OutPut = "";
  }
  return OutPut;
};


Meteor.methods({
    gmailSearch: function(uid, query) {
      var self = this;
      var insert = null;
      var uid = uid || Meteor.userId();
      var user = Meteor.users.findOne({_id : uid});
      this.unblock();
      try {
        gmailSearch.remove({user:user._id, query:query});
        var uri = 'gmail/v1/users/'+user.profile.email+"/messages";
        if(query) uri = uri + '?' + toQueryString({q:query})
        var response = GoogleApi.get(uri, {user:user});

        gmailSearch.insert({search:response, user:user._id, query:query});
        _.each(response.messages, function(item) {
          var id = item.id;
          var existing = gmail.findOne({_id: id});
          if(!existing) {
            var result = GoogleApi.get('gmail/v1/users/'+user.profile.email+"/messages/"+id, {user:user});
            var doc = {};

            for(i in result.payload.headers) {
              if(result.payload.headers[i].name == "Subject") doc.subject = result.payload.headers[i].value;
              if(result.payload.headers[i].name == "From") doc.from = result.payload.headers[i].value;
              if(result.payload.headers[i].name == "To") doc.to = result.payload.headers[i].value;
            }
            for(i in result.payload.parts) {
              if(result.payload.parts[i].mimeType == "multipart/alternative") {
                for(var j in result.payload.parts[i].parts) {
                  doc.htmlBody = decodeRawData(result.payload.parts[i].parts[j].body.data);
                }
              }
              if(result.payload.parts[i].mimeType == "text/plain") {
                doc.plainBody = decodeRawData(result.payload.parts[i].body.data);
              }
              if(result.payload.parts[i].mimeType == "text/html") {
                doc.htmlBody = decodeRawData(result.payload.parts[i].body.data);
              }
            }
            if(result.payload.body.size) {
              if(result.payload.mimeType == "text/html") doc.htmlBody = decodeRawData(result.payload.body.data);
              if(result.payload.mimeType == "text/plain") doc.plainBody = decodeRawData(result.payload.body.data);
            }
            doc.user = uid;
            doc._id = item.id;
            doc.user = uid;
            doc.query = query;
            doc.original = result;
            gmail.insert(doc);
          }
        }
      );
    } catch(error) {
      console.log(error);
    }
  },
  getMailLabels: function() {
    var result = GoogleApi.get('gmail/v1/users/'+Meteor.user().profile.email+"/labels");
    return result;
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
        fields = {'fullName' : user.profile.name, 'titles':user.profile.titles, 'primaryEmail' : user.profile.email, 'roles' : user.profile.roles,'phone' : user.profile.phone,'image' :Meteor.absoluteUrl().substring(0, Meteor.absoluteUrl().length - 1)+imageUrl};
        var signature = _.template(user.profile.signature)(fields);
        options.headers = options.headers || {"Content-Type":"application/atom+xml"};
        options.headers.Authorization = 'Bearer ' + Meteor.user().services.google.accessToken;
        options.content = '<?xml version="1.0" encoding="utf-8"?><atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:apps="http://schemas.google.com/apps/2006"><apps:property name="signature" value="'+signature.EncodeXMLEscapeChars()+'" /></atom:entry>';
        //options.data = {signature:"test"};

        Meteor.http.call("PUT", "https://apps-apis.google.com/a/feeds/emailsettings/2.0/coas.co.za/"+alias+"/signature", options, function( error, response ) {
          if ( error ) {
            future().return( error );
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
