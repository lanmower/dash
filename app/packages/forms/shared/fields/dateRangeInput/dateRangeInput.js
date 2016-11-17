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
  Template.dateRangeInput.cell = function(schema, item) {
    var start = item[schema.name+"-start"];
    var end = item[schema.name+"-end"];
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
        _.each(form.collection.find(tofind).fetch(), function(doc) {
          var start = doc[field.name+"Start"];
          var end = doc[field.name+"End"];

          if(moment(start).isAfter(end)) start = moment(end.format());

          _.each(field.preNotification, function(notification) {

            notificationDate = moment(start).subtract(notification.period, notification.periodUnit).format();
            if(moment(notificationDate).isBefore(new Date())) {
              _.each(notification.users, function(userId) {
                var user = Meteor.users.findOne(userId);
                var user = Meteor.users.findOne({_id:userId});
                var href = Meteor.absoluteUrl()+'form/update/'+form._id+'/'+doc._id;
                var message = notification.message;
                var subject = notification.subject;
                var messageHtml = notification.messageHtml;
                fields = {'user' : user, 'name' : user.profile.name,'createdAt' : moment(field.createdAt).format('MMMM Do, YYYY'), 'userName' : user.profile.name, 'email' : user.profile.email, 'userEmail' : user.profile.email, 'doc' : doc, 'date' : Date(), 'href' : href};
                fields = _.extend(fields, doc);
                Fiber(function() {

                  setTimeout(function() {
                    Email.send({
                      to: user.profile.email,
                      from: 'admin@coas.co.za',
                      subject: _.template(subject)(fields),
                      text: _.template(message)(fields),
                      html:_.template(messageHtml)(fields)
                    });
                  },10);
                });
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
    setInterval(run, 20000);
  };
}
