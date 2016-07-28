/*if(Meteor.isServer) Fiber = Npm.require('fibers');

Meteor.fieldTypes.push({label:"Leave Trigger", value: "leaveTrigger"});


Widgets.schemas.leaveTrigger = function() {
  return {

  }
};
function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

var dayDiff = function(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
};

Fields.schemas.leaveTrigger = function(data) {
  var name = data.name
  var output = {};
  output[name+"Frequency"] = {
        type: Number,
      };
  output[name+"FrequencyUnit"] = {
        type: String,
        allowedValues: ["days","months","years"],
        autoform: {
          afFieldInput: {
            options: [{label:"Dont reset", value:"noReset"}, {label:"Days", value:"days"}, {label:"Months", value:"months"}, {label:"Years", value:"years"}],
          }
        }
      };
  output[name+"Hours"] = {
        type: String,
      };
  output[name+"Unused"] = {
        type: [String],
        optional: true,
        label: "Unused fields",
        autoform: {
          type: "formList",
          afFieldInput: {
          options: function () {
            if(this.fieldsList) return this.fieldsList.get();
            var template = Template.instance().view.closest("Template.afQuickFields")._templateInstance;
            if(!template.fieldsList) template.fieldsList = ReactiveVar([]);
            this.fieldsList = template.fieldsList;
            return this.fieldsList.get();
          }
        }
      }
    };

  return output;
};
Fields.hooks.after.startup.leaveTrigger = function(form, formField) {
  var start = new Date();
  var run = function() {
    Fiber(function() {
      var end = new Date() - start;
      _.each(form.collection.find().fetch(), function(item) {
        var frequency = item.actionFrequency;
        var frequencyUnit = item.actionFrequencyUnit;
        var hours = item[formField.name+"Hours"];

        var setRemaining = function(diff, frequency, user, item, formField) {
          console.log("checking", diff, "against", frequency, "on", formField.name, "for", user.profile.name);
          if(diff > frequency) {
            console.log("passed, saving", {$set:{field:formField._id, user:user._id, doc:item._id, value:item[formField.name+"Hours"]}});
            if(item.unusedRule && item.value > 0) {
              var found = leaveStats.findOne({field:formField._id, user:user._id, doc:item._id});
              var originalUnused = leaveStats.findOne({field:formField._id, user:user._id, doc:item.unusedRule});
              if(found.value > 0) leaveStats.upsert({field:formField._id, user:user._id, doc:item.unusedRule},{$set:{date:new Date(),field:formField._id, user:user._id, doc:item._id, value:found.value+originalUnused.value}});
            }
            leaveStats.upsert({field:formField._id, user:user._id, doc:item._id},{$set:{date:new Date(),field:formField._id, user:user._id, doc:item._id, value:item[formField.name+"Hours"]}});
          }
        }
        _.each(Meteor.users.find().fetch(), function(user) {
          var diffTime = new Date();
          if(user.profile.employmentStartDate) diffTime = new Date(user.profile.employmentStartDate);

          stat = leaveStats.findOne({field:formField._id, user:user._id, doc:item._id});
          if(stat) diffTime = new Date(stat.date);

          var diff = dayDiff(new Date().getTime(), diffTime.getTime());

          if(item[formField.name+"FrequencyUnit"] == "days") {
            console.log("Checking days:");
            setRemaining(diff, item[formField.name+"Frequency"], user, item, formField);
          }
          if(item[formField.name+"FrequencyUnit"]== "months") {
            console.log("Checking months:");
            setRemaining(diff/30.41, item[formField.name+"Frequency"], user, item, formField);
          }
          if(item[formField.name+"FrequencyUnit"] == "years") {
            console.log("Checking years:");
            setRemaining(diff/365, item[formField.name+"Frequency"], user, item, formField);
          }
        });
      });
    }).run();
  };
  run();
  setInterval(run, 20000);
};
*/
