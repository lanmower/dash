Meteor.fieldTypes.push({label:"Leave Select Input", value: "leaveInput"});
var formsList = false;
Widgets.schemas.leaveInput = function() {
  return {
    title:{
      type: "leaveInput",
      optional: false
    },
    form:{
      autoform:{
        afFieldInput: {
          options: function () {
            if(formsList) return formsList.get();
            formsList = ReactiveVar([]);
            Template.instance().subscribe("forms", {
              onReady: function() {
                var forms = Forms.find().fetch();
                var list = [];
                _.each(forms, function(form) {
                  list.push({label:form.title, value:form._id});
                });
                formsList.set(list);
              }});
              return formsList.get();
            }
          },
        },
        type: String,
        optional: false
      }
    }
  };

  if(Meteor.isClient) {
    AutoForm.addInputType("leaveInput", {
      template: "afLeaveInput",
      valueOut: function () {
        return this.val();
      },
      valueConverters: {
        "stringArray": AutoForm.valueConverters.stringToStringArray,
        "number": AutoForm.valueConverters.stringToNumber,
        "numberArray": AutoForm.valueConverters.stringToNumberArray,
        "boolean": AutoForm.valueConverters.stringToBoolean,
        "booleanArray": AutoForm.valueConverters.stringToBooleanArray,
        "date": AutoForm.valueConverters.stringToDate,
        "dateArray": AutoForm.valueConverters.stringToDateArray
      },
      contextAdjust: function (context) {
        //can fix issues with some browsers selecting the firstOption instead of the selected option
        context.atts.autocomplete = "off";

        var itemAtts = _.omit(context.atts, 'firstOption');
        var firstOption = context.atts.firstOption;

        // build items list
        context.items = [];

        // If a firstOption was provided, add that to the items list first
        if (firstOption !== false) {
          context.items.push({
            name: context.name,
            label: (typeof firstOption === "string" ? firstOption : "(Select One)"),
            value: "",
            // _id must be included because it is a special property that
            // #each uses to track unique list items when adding and removing them
            // See https://github.com/meteor/meteor/issues/2174
            //
            // Setting this to an empty string caused problems if option with value
            // 1 was in the options list because Spacebars evaluates "" to 1 and
            // considers that a duplicate.
            // See https://github.com/aldeed/meteor-autoform/issues/656
            _id: "AUTOFORM_EMPTY_FIRST_OPTION",
            selected: false,
            atts: itemAtts
          });
        }

        // Add all defined options
        _.each(context.selectOptions, function(opt) {
          if (opt.optgroup) {
            var subItems = _.map(opt.options, function(subOpt) {
              return {
                name: context.name,
                label: subOpt.label,
                value: subOpt.value,
                htmlAtts: _.omit(subOpt, 'label', 'value'),
                // _id must be included because it is a special property that
                // #each uses to track unique list items when adding and removing them
                // See https://github.com/meteor/meteor/issues/2174
                //
                // The toString() is necessary because otherwise Spacebars evaluates
                // any string to 1 if the other values are numbers, and then considers
                // that a duplicate.
                // See https://github.com/aldeed/meteor-autoform/issues/656
                _id: subOpt.value.toString(),
                selected: (subOpt.value === context.value),
                atts: itemAtts
              };
            });
            context.items.push({
              optgroup: opt.optgroup,
              items: subItems
            });
          } else {
            context.items.push({
              name: context.name,
              label: opt.label,
              value: opt.value,
              htmlAtts: _.omit(opt, 'label', 'value'),
              // _id must be included because it is a special property that
              // #each uses to track unique list items when adding and removing them
              // See https://github.com/meteor/meteor/issues/2174
              //
              // The toString() is necessary because otherwise Spacebars evaluates
              // any string to 1 if the other values are numbers, and then considers
              // that a duplicate.
              // See https://github.com/aldeed/meteor-autoform/issues/656
              _id: opt.value.toString(),
              selected: (opt.value === context.value),
              atts: itemAtts
            });
          }
        });

        return context;
      }
    });

    Template.afLeaveInput.onCreated(function () {
      var data = this.data;
      var template = Template.instance().view.closest("Template.afQuickFields")._templateInstance;

      var field = Fields.findOne({parent:Router.current().params.form, name:data.name});

      template.subscribe('form', field.form,"",{
        onReady:function() {
          template.subscribe('formSearch', Router.current().params.form,"",{
            onReady:function() {
              template.subscribe('formSearch', field.form,"",{
                onReady:function() {
                  console.log('test');
                  var form = Forms.findOne({_id:field.form});
                  var docs = getCollection(form.collectionName).find().fetch();
                  var list= [];

                  _.each(docs, function(doc) {
                    var frequency = doc.frequency;
                    var frequencyUnit = doc.frequencyUnit;
                    var history = doc.history;
                    var historyUnit = doc.historyUnit;
                    var hours = Number.parseInt(doc.hours);
                    var employmentStartDate;
                    var user = Meteor.user();


                    if(user.profile.employmentStartDate) employmentStartDate = user.profile.employmentStartDate;
                    var today = new Date();

                    var start = moment(employmentStartDate).utc().format();
                    var end = moment(today).subtract(history, historyUnit);
                    if(moment(start).isAfter(end)) start = moment(end.format());

                    var historyDate;
                    if(parseInt(history) && parseInt(frequency)) {
                      for (var m = moment(start); m.isBefore(end); m.add(history, historyUnit)) {
                        historyDate = m;
                        console.log("Fastforward from employment date to history start "+m.format('YYYY-MM-DD'));
                      }
                      var start = moment(historyDate);
                      var end = today;
                      var totalHours = 0;
                      for (var m = start; m.isBefore(end); m.add(frequency, frequencyUnit)) {
                        historyDate = m.format();
                        totalHours += hours;
                        console.log("Fastforward from history start "+m.format('YYYY-MM-DD'));
                      }
                    }
                    //load used hours that havent ended yet
                    var loaded = getCollection(Forms.findOne(Router.current().params.form).collectionName).find({
                      rangeEnd : { $gte : new Date(historyDate) },
                      type : doc._id
                    }).fetch();

                    _.each(loaded, function(item) {
                      console.log(item);
                      totalHours -= parseInt(item.hours);
                    });
                    var toSet;
                    if(totalHours >= 0) toSet = {label:doc.title+": "+totalHours + " hours remaining.", value:doc._id};
                    else toSet = {label:doc.title+": 0 hours remaining. "+(-totalHours)+" overbooked!", value:doc._id};
                    list.push(toSet);
                  });
                  template.fieldsList.set(list);
                }
              });
            }
          });
        }
      });
    });
  }


  Fields.schemas.leaveInput = function(data) {
    var output = {};
    var name = data.name
    output[name] = {
      type: String,
      optional: true,
      label: data.title,
      autoform: {
        type: "leaveInput",
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
