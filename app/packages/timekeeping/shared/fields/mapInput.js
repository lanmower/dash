Meteor.fieldTypes.push({
  label: "Map Select Input",
  value: "mapInput"
});

var formsList = false;

Widgets.schemas.mapInput = function() {
  return {
    title: {
      type: String,
      optional: false
    }
  }
};

if (Meteor.isClient) {
    Template.afMapInput.created = function() {
      var self = this;
      this.position = new ReactiveVar();
      Location.locate(function(position) {
        self.position.set(position);
      });
    }

    Template.afMapInput.helpers({
      url : function() {
        var lat = 0;
        var lng = 0;
        if(Template.instance().position.get()) { 
          lat = Template.instance().position.get().latitude;
          lng = Template.instance().position.get().longitude;
          return "https://maps.googleapis.com/maps/api/staticmap?size=610x300&center="+lat+","+lng+"&zoom=15";
        }
      },
      lat: function() {
        if(Template.instance().position.get()) { 
          return Template.instance().position.get().latitude;
        }
      },
      lng: function() {
        if(Template.instance().position.get()) { 
          return Template.instance().position.get().longitude;
        }
      }
    });
    AutoForm.addInputType("mapInput", {
      template: "afMapInput"
    });
}


Fields.schemas.mapInput = function(data) {
  var output = {};
  var name = data.name
  output[name] = {
    type: String,
    optional: true,
    label: "",
    autoform: {
      type: "mapInput",
      label:false
    }
  };
  return output;
};
