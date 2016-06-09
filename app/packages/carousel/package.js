Package.describe({
  name: 'almagest:carousel',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');
  api.use('ecmascript');
  api.use("templating", "client");
  api.use('underscore');
  api.use('mongo');
  api.use('udondan:slick');
  api.use('almagest:core');

  api.addFiles('carousel.html', 'client');
  api.mainModule('carousel.js', 'client');
  api.addFiles('carousel.css', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');

  api.use('almagest:carousel');
  api.mainModule('carousel-tests.js');
});
