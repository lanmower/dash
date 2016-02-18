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
decodeRawData = function(body){
  if(body)
   return (new Buffer(body.replace(/-/g, '+').replace(/_/g, '/'), "base64")).toString();
};
var getMailMessage= function(id) {
  var result = GoogleApi.get('gmail/v1/users/'+Meteor.user().profile.email+"/messages/"+id);
  var retval = {};

  if(result.payload.body.size) retval.plainBody = {mimeType:"text/plain",data:decodeRawData(result.payload.body.data)};
  for(i in result.payload.headers) {
    if(result.payload.headers[i].name == "Subject") retval.subject = result.payload.headers[i].value;
    if(result.payload.headers[i].name == "From") retval.from = result.payload.headers[i].value;
    if(result.payload.headers[i].name == "To") retval.to = result.payload.headers[i].value;
  }
  for(i in result.payload.parts) {
    if(result.payload.parts[i].mimeType == "multipart/alternative") {
      for(var j in result.payload.parts[i].parts) {
        retval.htmlBody = decodeRawData(result.payload.parts[i].parts[j].body.data);
      }
    }
    if(result.payload.parts[i].mimeType == "text/plain") {
      for(var j in result.payload.parts[i].parts) {
        retval.plainBody = decodeRawData(result.payload.parts[i].parts[j].body.data);
      }
    }
  }
  retval.id = result.id;
  return retval;

}

Meteor.methods({
  getFiles: function(params) {
    var result = GoogleApi.get('drive/v2/files', {params:params});
    return result;
  },
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
      setSignature: function(_id) {
        user = Meteor.users.findOne({_id:_id});
        console.log(_id);
        alias = user.profile.email.split("@")[0];
        domain = user.profile.email.split("@")[1];
        if (user && user.services && user.services.google &&
            Meteor.user().services.google.accessToken) {
          var options = {};

          fields = {'fullName' : user.profile.name, 'title':'', 'primaryEmail' : user.profile.email, 'role' : user.profile.role,'phone' : user.profile.phone,'image' :Meteor.absoluteUrl().substring(0, Meteor.absoluteUrl().length - 1)+Files.findOne({_id:user.profile.picture}).url()};
          var signature = _.template(user.profile.signature)(fields);
          options.headers = options.headers || {"Content-Type":"application/atom+xml"};
          options.headers.Authorization = 'Bearer ' + Meteor.user().services.google.accessToken;
          options.content = '<?xml version="1.0" encoding="utf-8"?><atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:apps="http://schemas.google.com/apps/2006"><apps:property name="signature" value="'+signature.EncodeXMLEscapeChars()+'" /></atom:entry>';
          //options.data = {signature:"test"};
          var list = GoogleApi.get('drive/v2/files', {params:{'q':''}});

          Meteor.http.call("PUT", "https://apps-apis.google.com/a/feeds/emailsettings/2.0/coas.co.za/admin/signature", options, function(error, result) {
            console.log(error, result, options);
          });
        } else {
          callback(new Meteor.Error(403, "Auth token not found. Connect your google account"));
        }
    return "";
  },

  getDiary: function(params) {

  var list = GoogleApi.get('drive/v2/files', {params:{'q':'"0B4GAIeqJCOSTfmRMZDdCdV9QUFZCV3VkbU4zZFR4LVJ1dUNlZmNRTXYxTG9wYjRKc3BjRk0" in parents AND title contains "admin@coas.co.za"'}});
  var todayPath = GoogleApi.get('drive/v2/files', {params:{'q':'"'+list.items[0].id+'" in parents AND title contains "today"'}});
  var today = GoogleApi.get('drive/v2/files', {params:{'q':'"'+todayPath.items[0].id+'" in parents AND title contains "today"'}});
  return today.items[0].id;
  },
  setDiary: function(diary) {
  },
  getMailLabels: function() {
    var result = GoogleApi.get('gmail/v1/users/'+Meteor.user().profile.email+"/labels");
    return result;
  },
  sendEmail: function (to, from, subject, text, html) {
    check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    //actual email sending method
    Email.send({to: to, from: from, subject: subject, text: text, html:html});
  },
  listMailMessages: function() {
    var result = GoogleApi.get('gmail/v1/users/'+Meteor.user().profile.email+"/messages");
    for(var i in result.messages) {
      var id = result.messages[i].id;
      result.messages[i] = getMailMessage(id);
    }
    return result;
  },
  getMailMessage: getMailMessage,
  getMailMessages: function(ids) {
    var result;
    var user = Meteor.user();
    var Batchelor = Meteor.npmRequire("batchelor");
    var batch = new Batchelor({
      'uri':'https://www.googleapis.com/batch',
      'method':'GET',
      'auth': {
          'bearer': user.services.google.accessToken
      },
      'headers': {
          'Content-Type': 'multipart/mixed'
      }
    });
    batch.add({
        'method':'GET',
        'path':'gmail/v1/users/'+Meteor.user().profile.email+"/messages"
    })
    var result = batch.run(function(err, response) {
      result = response;
      console.log(err);
      console.log(response);
    });
    console.log("done");
    return result;
  },
  /**
   * update a user's permissions
   *
   * @param {Object} targetUserId Id of user to update
   * @param {Array} roles User's new permissions
   * @param {String} group Company to update permissions for
   */
  updateRoles: function (targetUserId, roles, group) {
    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['manage-users'])) {
      throw new Meteor.Error(403, "Access denied")
    }

    Roles.setUserRoles(targetUserId, roles, group);
    return "Done";
  },
  'server\method_name': function () {
    // server method logic
  }
});
