Meteor.methods({

  sendEmail: function ({to, from, subject, text, html}) {
    check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    //actual email sending method
    Email.send({to: to, from: from, subject: subject, text: text, html:html});
  },
  approve: function(fieldId, docId, userId, setting) {
    //var setting = (setting == true)?true:false;
    var retval;
    var field = Fields.findOne({_id:fieldId});
    var form = Forms.findOne(field.parent);
    if(form && field) {
      var selector = {field:fieldId, doc:docId, user:userId};
      var approval = Approvals.findOne(selector);

      if(approval) {
        Approvals.update(approval._id, {$set:{value:setting}});
      } else {
        console.log(docId, fieldId, userId);
        Approvals.insert(_.extend(selector,{value:setting}));
      }
      retval = true;
    }
    Fields.hooks.after.update.approveInput(userId, getCollection(form._id).findOne(docId), Meteor.forms[form._id], field);
  }
});
