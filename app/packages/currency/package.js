Package.describe({
  name: 'almagest:currency',
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
  api.use('templating', "client");
  api.use('aldeed:autoform');
  api.use('almagest:core');
  api.use('reactive-var');
  api.use('underscore');
  api.use('momentjs:moment');

  api.mainModule('currency.js');
  api.addFiles('calculator.html', 'client');
  api.addFiles('calculator.js', 'client');
  api.addFiles('currencyInput/currencyInput.html', 'client');
  api.addFiles('currencyInput/currencyInput.js', ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:currency');
  api.mainModule('currency-tests.js');
});
