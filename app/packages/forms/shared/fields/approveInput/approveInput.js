Meteor.fieldTypes.push({label:"Approve Input", value:"approveInput"});

Widgets.schemas.approveInput = function() {
  return {
    title:{
      type: String,
      optional: false,
    },
    admins:{
          type: [String],
          optional: true,
          // minCount: 1,
          autoform: {
            type: "universe-select",
            afFieldInput: {
              multiple: true,
              options: function () {
                return Meteor.rolesList();
              }
            }
          }
      },
    max:{
      type: String,
      optional: false,
    },
    ownerSubmissionSubject:{
      type: String,
      optional: false
    },
    ownerSubmissionMessage:{
      type: String,
      optional:false
    },
    ownerSubmissionMessageHtml:{
      type: String,
      optional:false,
      autoform: {
        afFieldInput: {
          type: 'summernote',
        }
      }

    },
    ownerCompleteSubject:{
      type: String,
      optional: false,
    },
    ownerCompleteMessage:{
      type: String,
      optional:false
    },
    ownerCompleteMessageHtml:{
      type: String,
      optional:false,
      autoform: {
        afFieldInput: {
          type: 'summernote',
        }
      }

    },
    ownerApprovalSubject:{
      type: String,
      optional: false,
    },
    ownerApprovalMessage:{
      type: String,
      optional:false
    },
    ownerApprovalMessageHtml:{
      type: String,
      optional:false,
      autoform: {
        afFieldInput: {
          type: 'summernote',
        }
      }

    },
    adminPendingSubject:{
      type: String,
      optional: false,
    },
    adminPendingMessage:{
      type: String,
      optional:false
    },
    adminPendingMessageHtml:{
      type: String,
      optional:false,
      autoform: {
        afFieldInput: {
          type: 'summernote',
        }
      }

    }
  }
};

SimpleSchema.messages({notAllowed: "Not allowed"});

var getApprovals = function(approvals) {
  var retval = [];
  _.each(approvals, function(approval) {
    var user = Meteor.users.findOne(approval.user);
    var userName = user.profile.name;
    var retItem = {name:userName};
    retval.push(retItem);
  });
  return retval;
}

if(Meteor.isClient) {
  Template.afApproveInput.helpers({
    canAdmin: function() {
      var field = Fields.findOne({parent:Router.current().params.form, name:this.name});
      return _.contains(field.admins, Meteor.userId());
    },
    approvals: function() {
      var router = Router.current();
      var field = Fields.findOne({parent:Router.current().params.form, name:this.name});
      var approvals = Approvals.find({doc:router.params._id, field:field._id, value:true}).fetch();
      return getApprovals(approvals);
    },
    rejections: function() {
      var router = Router.current();
      var field = Fields.findOne({parent:Router.current().params.form, name:this.name});
      var approvals = Approvals.find({doc:router.params._id, field:field._id, value:false}).fetch();
      return getApprovals(approvals);
    },
    approvalsCount: function() {
      var router = Router.current();
      var field = Fields.findOne({parent:Router.current().params.form, name:this.name});
      var subscription = router.subscribe('approvals', field._id, router.params._id);
      return Approvals.find({doc:router.params._id, field:field._id, value:true}).count();
    },
    rejectionsCount: function() {
      var router = Router.current();
      var field = Fields.findOne({parent:Router.current().params.form, name:this.name});
      return Approvals.find({doc:router.params._id, field:field._id, value:false}).count();
    },
    getId: function() {
      return Router.current().params._id;
    },
    getField: function() {
      var field = Fields.findOne({parent:Router.current().params.form, name:this.name});
      return field._id;
    }
  });
  Meteor.startup(function () {
      AutoForm.addInputType("approveInput", {
        template: "afApproveInput",
      });
  });
}

Fields.schemas.approveInput = function(field) {
  var name = field.name;
  var output = {};
  output[name] = {
        type: [String],
        optional: true,
        blackbox: true,
        //allowedValues: field.admins,
        autoform: {
          type:"hidden",
          afFieldInput: {
            label: function() {
                  return _.contains(field.admins, Meteor.userId())?"Approve":false;
            },
            type: 'approveInput',
          },
        },
        label: field.title,
        //custom: function () {
          //if (this.isSet && _.contains(field.admins, Meteor.userId())) {
          //  return "notAllowed";
          //}
          //return true;
        //}
      };
      return output;
  };

  var notifyUpdate = function(userId, doc, form, field) {
    var approvals = Approvals.find({field:field._id, doc:doc._id, value:true}).count();
    var owner = Meteor.users.findOne(doc.createdBy);
    if(approvals >= field.max) {
      sendIt(field, owner, doc, form, field.ownerCompleteSubject, field.ownerCompleteMessage, field.ownerCompleteMessageHtml);
    }/* else {
      sendIt(field, owner, doc, form, field.ownerApprovalSubject, field.ownerApprovalMessage, field.ownerApprovalMessageHtml);
    }*/
    _.each(field.admins, function(adminId) {
      var admin = Meteor.users.findOne(adminId);
      if(!Approvals.find({field:field._id, doc:doc._id, value:true, user:admin._id}).count())
        sendIt(field, admin, doc, form, field.adminPendingSubject, field.adminPendingMessage, field.adminPendingMessageHtml);
    });
  }

  var notifyInsert = function(userId, doc, form, field) {
    var max = doc[field.name]?doc[field.name].length:0;
    var owner = Meteor.users.findOne(userId);

    sendIt(field, owner, doc, form, field.ownerSubmissionSubject, field.ownerSubmissionMessage, field.ownerSubmissionMessageHtml);
    _.each(field.admins, function(adminId) {
      var admin = Meteor.users.findOne(adminId);
      sendIt(field, admin, doc, form, field.adminPendingSubject, field.adminPendingMessage, field.adminPendingMessageHtml);
    });
  }


var sendIt = function(field, toUser, doc, form, subject, message, messageHtml) {
  var user = Meteor.users.findOne(doc.createdBy);
  var approveHref = field?Meteor.absoluteUrl()+'form/approve/'+doc._id+"/"+field._id+"/true":null;
  var rejectHref = field?Meteor.absoluteUrl()+'form/approve/'+doc._id+"/"+field._id+"/false":null;
  var visitHref = Meteor.absoluteUrl()+'form/update/'+form._id+'/'+doc._id;
  var fields = {'name' : toUser.profile.name,'createdAt' : moment(field.createdAt).format('MMMM Do, YYYY'), 'userName' : user.profile.name, 'email' : user.profile.email, 'userEmail' : user.profile.email, 'date' : Date(), 'visitHref' : visitHref, 'approveHref' : approveHref, 'rejectHref' : rejectHref};
  fields = _.extend(fields, doc);
  subject = _.template(subject)(fields);
  message = _.template(message)(fields);
  messageHtml = _.template(messageHtml)(fields);

  var toEmail = null;
  if(toUser.profile && toUser.profile.email) {
    Fiber = Npm.require('fibers');
    Fiber(function() {
      setTimeout(10, function() {
        Email.send({
          to: toUser.profile.email,
          from: 'admin@coas.co.za',
          subject: subject,
          text: message,
          html: messageHtml
        });
      });
    });
  }
  bpNotifications.send({title:"test", message:subject, url:visitHref}, toUser._id);
}

Fields.hooks.after.update.approveInput = notifyUpdate;
Fields.hooks.after.insert.approveInput = notifyInsert;
