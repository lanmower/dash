Meteor.fieldTypes.push({
  label: "Currency Input",
  value: "currencyInput"
});


Widgets.schemas.currencyInput = function() {
  return {
    market: {
      autoform: {
        afFieldInput: {
          options: function() {
            if (formsList) return formsList.get();
            formsList = ReactiveVar([]);
            Template.instance().subscribe("forms", {
              onReady: function() {
                var forms = Forms.find().fetch();
                var list = [];
                _.each(forms, function(form) {
                  list.push({
                    label: form.title,
                    value: form._id
                  });
                });
                formsList.set(list);
              }
            });
            return formsList.get();
          }
        },
      },
      type: String,
      optional: false
    },
    to: {
      autoform: {
        afFieldInput: {
          options: function() {
            if (formsList) return formsList.get();
            formsList = ReactiveVar([]);
            Template.instance().subscribe("forms", {
              onReady: function() {
                var forms = Forms.find().fetch();
                var list = [];
                _.each(forms, function(form) {
                  list.push({
                    label: form.title,
                    value: form._id
                  });
                });
                formsList.set(list);
              }
            });
            return formsList.get();
          }
        },
      },
      type: String,
      optional: false
    },

    title: {
      type: String,
      optional: false,
    },
    optional: {
      type: Boolean,
    },
    searchable: {
      type: Boolean,
    }
  }
};

if (Meteor.isClient) {
  AutoForm.addInputType("currency", {
    template: "afInputCurrency",
    valueOut: function() {
      return AutoForm.valueConverters.stringToNumber(this.val());
    },
    valueConverters: {
      "string": AutoForm.valueConverters.numberToString,
      "stringArray": AutoForm.valueConverters.numberToStringArray,
      "numberArray": AutoForm.valueConverters.numberToNumberArray,
      "boolean": AutoForm.valueConverters.numberToBoolean,
      "booleanArray": AutoForm.valueConverters.numberToBooleanArray
    },
    contextAdjust: function(context) {
      if (typeof context.atts.max === "undefined" && typeof context.max === "number") {
        context.atts.max = context.max;
      }
      if (typeof context.atts.min === "undefined" && typeof context.min === "number") {
        context.atts.min = context.min;
      }
      if (typeof context.atts.step === "undefined" && context.decimal) {
        context.atts.step = '0.01';
      }
      return context;
    }
  });

  Template.afInputCurrency.created = function() {
    var instance = this;
    this.market = ReactiveVar();
    this.to = ReactiveVar();
    this.quant = ReactiveVar();
    this.quant.set(instance.data.value); //
    console.log(this);
    instance.subscribe('form', instance.data.atts.market, "", {
      onReady: function() {
        instance.subscribe('form', instance.data.atts.to, "", {
          onReady: function() {
            instance.subscribe('formSearch', instance.data.atts.market, "", {
              onReady: function() {
                var marketform = Forms.findOne({
                  _id: instance.data.atts.market
                });
                var marketdocs = getCollection(marketform._id);
                instance.market.set(marketdocs.findOne().value);
                instance.subscribe('formSearch', instance.data.atts.to, "", {
                  onReady: function() {
                    var toform = Forms.findOne({
                      _id: instance.data.atts.to
                    });
                    var todocs = getCollection(toform._id);
                    instance.to.set(todocs.findOne().value);
                  }
                });
              }
            });
          }
        });
      }
    });
  };

  Template.afInputCurrency.helpers({
    to: function() {
      var instance = Template.instance();
      var to = instance.to.get();
      var quant = instance.quant.get();
      return (quant * to) || "0.00";
    },
    market: function() {
      var instance = Template.instance();
      var market = instance.market.get();
      var quant = instance.quant.get();
      return (quant * market) || "0.00";
    }
  });

  Template.afInputCurrency.events({
    'keyup input': _.debounce(function(event, instance) {
      event.preventDefault();
      instance.quant.set(instance.find('input').value);
    }, 300)
  });

}

Fields.schemas.currencyInput = function(data) {
  var name = data.name
  var output = {};
  output[name] = {
    type: Number,
    decimal: true,
    autoform: {
      step: "0.01",
      market: data.market,
      to: data.to,
      afFieldInput: {
        type: 'currency',
      },
    },
    label: data.title,
    optional: data.optional ? true : false
  };
  return output;
};
