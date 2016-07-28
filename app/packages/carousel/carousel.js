// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See carousel-tests.js for an example of importing.
Meteor.widgetTypes.push({label:"Carousel", value:"carousel"});

Widgets.schemas.carousel = function() {
  return {
    'slides':{
      type: Array,
      optional: false,
    },
    'slides.$':{
      type: Object,
    },
    'slides.$.body':{
      type: String,
      optional: false,
      autoform: {
        afFieldInput: {
          type: 'summernote',
        }
      }
    },
  }
};

Template.carousel.rendered = function() {
    $(this.find('#carousel')).slick({
      dots: true,
      arrows: true
    });
  }
