Meteor.fieldTypes.push({label:"Date range Input", value: "dateRangeInput"});

Widgets.schemas.dateRangeInput = function() {
  return {
    title:{
      type: String,
      optional: false,
    },
    "preNotification.$.users":{
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
    "preNotification.$.period":{
      type: String,
      optional: false,
    },
    "preNotification.$.periodUnit":{
      type: String,
      optional: false,
    },
    "preNotification.$.subject":{
      type: String,
      optional: false
    },
    "preNotification.$.message":{
      type: String,
      optional:false
    },
    "preNotification.$.messageHtml":{
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

  if(Meteor.isClient) {
    Template.dateRangeInput.cell = function(name, item, schema, field) {
      var start = item[name+"-start"];
      var end = item[name+"-end"];
      return moment(start).format('MMMM Do, YYYY')+" to "+moment(end).format('MMMM Do, YYYY');
    }
  }

Fields.schemas.dateRangeInput = function(data) {
  var name = data.name
  var output = {};
  output[name+"Start"] = {
        type: String,
        label: data.title+" start.",
        autoform: {
          type: "datetimepicker"
        }
    };
    output[name+"End"] = {
          type: String,
          label: data.title+" end.",
          autoform: {
            type: "datetimepicker"
          }
      };
    output[name+"Notified"] = {
          type: Boolean,
          label: "Notified"
      };
    return output;
  };

if(Meteor.isServer) {
  Fiber = Npm.require('fibers');
  Fields.hooks.after.startup.dateRangeInput = function(form, field) {
    var start = new Date();

    var run = function() {
      Fiber(function() {
        var end = new Date() - start;
        var thename = field["name"]+"Notified";
        var tofind = {}
        tofind[thename]=null;
        console.log(tofind);
        _.each(form.collection.find(tofind).fetch(), function(doc) {
          var start = doc[field.name+"Start"];
          var end = doc[field.name+"end"];
          if(moment(start).isAfter(end)) start = moment(end.format());
          console.log("Date range startup hook", field);

          _.each(field.preNotification, function(notification) {

            notificationDate = moment(start).subtract(notification.period, notification.periodUnit).format();
            if(moment(notificationDate).isBefore(new Date())) {
             _.each(notification.users, function(userId) {
               var user = Meteor.users.findOne(userId);
               console.log('sendingit');
               sendIt(field, user.profile.email, doc, form, user._id, notification.subject, notification.message, notification.messageHtml)
             });
             var toset = {};
             toset.$set = {};
             toset.$set[thename] = true;
             form.collection.update({_id:doc._id}, toset);
            }
          });
        });
      }).run();
    };
    run();
    setInterval(run, 20000);
  };
}

var sendIt = function(field, to, doc, form, userId, subject, message, messageHtml) {
  var user = Meteor.users.findOne({_id:userId});
  var href = Meteor.absoluteUrl()+'form/update/'+form._id+'/'+doc._id;
  fields = {'user' : user, 'name' : user.profile.name,'createdAt' : moment(field.createdAt).format('MMMM Do, YYYY'), 'userName' : user.profile.name, 'email' : user.profile.email, 'userEmail' : user.profile.email, 'doc' : doc, 'date' : Date(), 'href' : href};
  fields = _.extend(fields, doc);
  Fiber = Npm.require('fibers');
  Fiber(function() {
    setTimeout(function() {
      console.log('sending',_.template(messageHtml)(fields), "To", to, 'admin@coas.co.za');
      Email.send({
        to: to,
        from: 'admin@coas.co.za',
        subject: _.template(subject)(fields),
        text: _.template(message)(fields),
        html:_.template(messageHtml)(fields)
      },10);
    });
  });
}
