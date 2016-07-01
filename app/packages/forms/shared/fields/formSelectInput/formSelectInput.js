Meteor.fieldTypes.push({label:"Form Select Input", value: "formSelectInput"});
var formsList = false;
Widgets.schemas.formSelectInput = function() {
  return {
    title:{
      type: "formList",
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
    AutoForm.addInputType("formList", {
      template: "afFormList",
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
  Template.afFormList.onCreated(function () {
    var data = this.data;
    var template = Template.instance().view.closest("Template.afQuickFields")._templateInstance;
    this.subscribe("form", data.atts.form, {
      onReady: function () {
        template.subscribe('formSearch', data.atts.form,"",{
          onReady:function() {
            var form = Forms.findOne({_id:data.atts.form});
            var docs = getCollection(form.collectionName).find().fetch();
            var list = [];
            _.each(docs, function(doc) {
              list.push({label:doc.title, value:doc._id});
            });
            template.data.attr.fieldsList.set(list);
          }
        });
      },
      onError: function () { console.log("onError", arguments);}
    });
  });
}

Fields.schemas.formSelectInput = function(data) {
  var output = {};
  var name = data.name;
  var fieldsList = ReactiveVar([]);
  output[name] = {
        type: [String],
        optional: true,
        label: data.title,
        autoform: {
          type: "formList",
          form: data.form,
          fieldsList: fieldsList,
          afFieldInput: {
          options: function () {
            return fieldsList.get();
          }
        }
      }
    };
    return output;
  };
