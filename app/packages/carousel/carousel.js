// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See carousel-tests.js for an example of importing.
Meteor.widgetTypes.push({label:"Carousel", value:"carousel"});

Template.carousel.rendered = function() {
    $(this.find('#carousel')).slick({
      dots: true,
      arrows: true
    });
  }
