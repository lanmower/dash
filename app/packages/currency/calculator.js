// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See currency-tests.js for an example of importing.
Meteor.widgetTypes.push({label:"Currency Calculator", value:"calculator"});
Widgets.schemas.calculator = function() {
  return {
    market:{
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
      },
      to:{
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
        },

      }
    };
    Template.calculator.created = function() {
      var instance = this;
      this.market = ReactiveVar();
      this.to = ReactiveVar();
      this.quant = ReactiveVar();
      instance.subscribe('form', instance.data.market,"",{
        onReady:function() {
          instance.subscribe('form', instance.data.to,"",{
            onReady:function() {
              instance.subscribe('formSearch', instance.data.market,"",{
                onReady:function() {
                  var marketform = Forms.findOne({_id:instance.data.market});
                  var marketdocs = getCollection(marketform.collectionName);
                  instance.market.set(marketdocs.findOne().value);
                  instance.subscribe('formSearch', instance.data.to,"",{
                    onReady:function() {
                      var toform = Forms.findOne({_id:instance.data.to});
                      var todocs = getCollection(toform.collectionName);
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
    Template.calculator.helpers({
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

    Template.calculator.events({
      "submit .form": function(event) {
        return false;
      },
      'keyup .form input': _.debounce(function(event, instance) {
        event.preventDefault();
        instance.quant.set(instance.find('.form input').value);
      }, 300)
    });
