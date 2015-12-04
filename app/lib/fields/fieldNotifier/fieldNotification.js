
Widgets.schemas.fieldNotification = function(tschema, parent, type, self) {
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
      type: String,
      optional: true
    },
    fields: {
      type: [String],
      autoform: {
        //type: "universe-select",
        /*afFieldInput: {
          multiple: true,
          options: function () {
            var output = [];
            Template.instance().subscribe('form', parent);
              _.each(AutoForm.getFormSchema().schema(), function(item, key) {
                output.push({label:key, value:key});
              });
              return output;
          }
        }*/
      }
    }
  }
};

Fields.schemas.fieldNotification = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
    type: String,
    optional: true,
    autoform: {
      type: "hidden"
    }
  };
  return output;

};

var notify = function(userId, doc, form, item) {
  var min = 0;
  var user = Meteor.users.findOne({_id:userId});
  var createdBy = Meteor.users.findOne({_id:doc.createdBy});
  var formFields = form.fields.fetch();
  _.each(item.fields, function(field) {
    if(!doc[field]) ++min;
  });
  if(min) {
    console.log('approved, sending notification');

    fields = {'name' : user.profile.name, 'email' : user.profile.email, 'doc' : doc, 'date' : Date(), 'href' : Meteor.absoluteUrl()+'form/update/'+form._id+'/'+doc._id};
    if(item.email) {
      _.each(item.email, function(to) {
        if(to != user.profile.email)
          Email.send({
            to: to,
            from: 'admin@coas.co.za',
            subject: _.template(item.mailSubject)(fields),
            text: _.template(item.mailMessage)(fields),
            html:_.template(item.mailMessageHtml)(fields)
          });
      });
    } else {
      Email.send({
        to: createdBy.profile.email,
        from: 'admin@coas.co.za',
        subject: _.template(item.mailSubject)(fields),
        text: _.template(item.mailMessage)(fields),
        html:_.template(item.mailMessageHtml)(fields)
      });
    }
  }
}
Fields.hooks.after.update.fieldNotification = notify;
Fields.hooks.after.insert.fieldNotification = notify;
