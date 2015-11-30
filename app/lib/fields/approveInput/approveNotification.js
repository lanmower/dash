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
    type: String,
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
    console.log(item.name);
    var min = 0;
    var user = Meteor.users.findOne({_id:userId});
    var formFields = form.fields.fetch();
    _.each(formFields, function(field) {
      if(field.type == "approveInput") {
        if(doc[field.name] == 'Approved') {
          console.log("Found approval ", field.name);
          ++min;
        }
      }
    });
    console.log(min, item.min);
    if(min == item.min) {
      console.log('approved, sending notification');

      fields = {'name' : user.profile.name, 'email' : user.profile.email, 'doc' : doc, 'date' : Date(), 'href' : Meteor.absoluteUrl()+'form/update/'+form._id+'/'+doc._id};
      if(item.email) fields['email'] = item.email;
      var opts = {
        to: user.profile.email,
        from: 'admin@coas.co.za',
        subject: _.template(item.mailSubject)(fields),
        text: _.template(item.mailMessage)(fields),
        html:_.template(item.mailMessageHtml)(fields)
      };
      Email.send(opts);
      console.log(opts);
    }
  }
  Fields.hooks.after.update.approveNotification = notify;
  Fields.hooks.after.insert.approveNotification = notify;
