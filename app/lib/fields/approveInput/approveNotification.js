Meteor.fieldTypes.push({label:"Approve Notification", value:"approveNotification"});
Widgets.schemas.approveNotification = function() {
  return {
    mailSubject:{
      type: String,
      optional: false,
      //autoform: {
      //  afFieldInput: {
      //value:"Your form submission has been approved"
      //  }
      //}
    },
    mailMessage:{
      type: String,
      optional: false,
      //autoform: {
      //  afFieldInput: {
      //value:"Your form submission has been approved"
      //  }
      //}
    },
    mailMessageHtml:{
      type: String,
      optional: false,
      autoform: {
        afFieldInput: {
          type: 'summernote',
          //value:"<h1>Your form submission has been approved<h1> Click <a>here</a>"
        }
      }
    },
    email: {
      type: [String],
      optional: true
    },
    min:{
      type: Number,
      optional: false
    }
  }
};

Fields.schemas.approveNotification = function(data) {
  var name = data.name
  var output = {};
  /*output[name] = {
    type: String,
    optional: true,
    autoform: {
      type: "hidden"
    }
  };*/
  return output;

};

var notify = function(userId, doc, form, item) {
  console.log('test');
  var min = 0;
  var user = Meteor.users.findOne({_id:doc.createdBy});
  var submitter = Meteor.users.findOne({_id:userId});
  var formFields = form.fields.fetch();
  _.each(formFields, function(field) {
    if(field.type == "approveInput") {
      if(doc[field.name] == 'Approved') {
        ++min;
      }
    }
  });
  console.log("min", min);
  if(min == item.min) {
    console.log('sending notification');
    if(item.email) {
      _.each(item.email, function(to) {
        var toUser = Meteor.users.findOne({"profile.email":to});
        if(toUser) {
          var userInput = null;
          _.each(formFields, function(field) {
            if(field.type == "approveInput") {
              if(field.user == toUser._id) {
                userInput = field;
              }
            }
          });
          var approveHref = userInput?Meteor.absoluteUrl()+'form/approve/'+form._id+'/'+doc._id+"/"+userInput._id+"/true":null;
          var rejectHref = userInput?Meteor.absoluteUrl()+'form/approve/'+form._id+'/'+doc._id+"/"+userInput._id+"/false":null;

          var href = Meteor.absoluteUrl()+'form/update/'+form._id+'/'+doc._id;
          fields = {'submitter' : submitter, 'name' : user.profile.name,'createdAt' : moment(item.createdAt).format('MMMM Do, YYYY'), 'submitterName' : submitter.profile.name, 'email' : user.profile.email, 'submitterEmail' : submitter.profile.email, 'doc' : doc, 'date' : Date(), 'href' : href, 'approveHref' : approveHref, 'rejectHref' : rejectHref};
          fields = _.extend(fields, doc);
          if(to != user.profile.email) {
            Email.send({
              to: to,
              from: 'admin@coas.co.za',
              subject: _.template(item.mailSubject)(fields),
              text: _.template(item.mailMessage)(fields),
              html:_.template(item.mailMessageHtml)(fields)
            });
          }
        }
      });
    } else {
      var to = user.profile.email;
      Email.send({
        to: to,
        from: 'admin@coas.co.za',
        subject: _.template(item.mailSubject)(fields),
        text: _.template(item.mailMessage)(fields),
        html:_.template(item.mailMessageHtml)(fields)
      });
    }

  }
}
Fields.hooks.after.update.approveNotification = notify;
Fields.hooks.after.insert.approveNotification = notify;
