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
      var uri = 'gmail/v1/users/'+user.profile.email+"/messages";
      var response = null;
      gmailSearch.remove({user:user._id, query:query});
      if(query) uri = uri + '?' + toQueryString({q:query});
      try {
        response = GoogleApi.get(uri, {user:user});
        gmailSearch.insert({search:response, user:user._id, query:query});
      } catch(error) {
        console.log(error);  
        if(error.error == 500) {
            Meteor.call("exchangeRefreshTokenAdmin", user._id);
            user = Meteor.users.findOne({_id : uid});
            console.log("Refresh token exchanged");
          try {
            response = GoogleApi.get(uri, {user:user});
            gmailSearch.insert({search:response, user:user._id, query:query});
          } catch(error) {
            console.log("Error updating messages");
            console.log(error);
          }
        }
      }
        if(response && response.messages) {
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
    }
  

  },
  getMailLabels: function() {
    var result = GoogleApi.get('gmail/v1/users/'+Meteor.user().profile.email+"/labels");
    return result;
  }
});
