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
      console.log(this);
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
    console.log(field);

    var approvals = Approvals.find({field:field._id, doc:doc._id, value:true}).count();
    var owner = Meteor.users.findOne(doc.createdBy);
    if(approvals > field.max) {
      sendIt(field, owner.profile.email, doc, form, doc.createdBy, field.ownerApprovalSubject, field.ownerApprovalMessage, field.ownerApprovalMessageHtml);
    } else {
      sendIt(field, owner.profile.email, doc, form, doc.createdBy, field.ownerCompleteSubject, field.ownerCompleteMessage, field.ownerCompleteMessageHtml);
    }
    _.each(field.admins, function(adminId) {
      var admin = Meteor.users.findOne(adminId);
      if(!Approvals.find({field:field._id, doc:doc._id, value:true, user:admin._id}).count())
        sendIt(field, admin.profile.email, doc, form, userId, field.adminPendingSubject, field.adminPendingMessage, field.adminPendingMessageHtml);
    });
  }

  var notifyInsert = function(userId, doc, form, field) {
    var max = doc[field.name]?doc[field.name].length:0;
    console.log(userId);
    var owner = Meteor.users.findOne(userId);

    sendIt(field, owner.profile.email, doc, form, userId, field.ownerSubmissionSubject, field.ownerSubmissionMessage, field.ownerSubmissionMessageHtml);
    _.each(field.admins, function(adminId) {
      var admin = Meteor.users.findOne(adminId);
      sendIt(field, admin.profile.email, doc, form, userId, field.adminPendingSubject, field.adminPendingMessage, field.adminPendingMessageHtml);
    });
  }

var sendIt = function(field, to, doc, form, userId, subject, message, messageHtml) {
  var user = Meteor.users.findOne({_id:userId});
  var approveHref = field?Meteor.absoluteUrl()+'form/approve/'+doc._id+"/"+field._id+"/true":null;
  var rejectHref = field?Meteor.absoluteUrl()+'form/approve/'+doc._id+"/"+field._id+"/false":null;
  var href = Meteor.absoluteUrl()+'form/update/'+form._id+'/'+doc._id;
  console.log('href',href);
  fields = {'user' : user, 'name' : user.profile.name,'createdAt' : moment(field.createdAt).format('MMMM Do, YYYY'), 'userName' : user.profile.name, 'email' : user.profile.email, 'userEmail' : user.profile.email, 'doc' : doc, 'date' : Date(), 'href' : href, 'approveHref' : approveHref, 'rejectHref' : rejectHref};
  fields = _.extend(fields, doc);
  console.log('sending',_.template(messageHtml)(fields), "To", to);
  Fiber = Npm.require('fibers');
  Fiber(function() {
    setTimeout(10, function() {
      Email.send({
        to: to,
        from: 'admin@coas.co.za',
        subject: _.template(subject)(fields),
        text: _.template(message)(fields),
        html:_.template(messageHtml)(fields)
      });
    });
  });
}

Fields.hooks.after.update.approveInput = notifyUpdate;
Fields.hooks.after.insert.approveInput = notifyInsert;
