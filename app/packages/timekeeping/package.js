Package.describe({
  name: 'almagest:punches',
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
  api.versionsFrom("1.3.2.4")
  api.use('underscore');
  api.use('ecmascript');
  api.use('almagest:core');
  api.use('templating', "client");
  api.use('dburles:collection-helpers');
  api.use('mongo');
  api.use("iron:router");
  api.use('aldeed:autoform');
  api.use("aldeed:delete-button");
  api.use("vazco:universe-autoform-select");
  api.use('aldeed:collection2');
  api.use('vazco:maps');
  api.use("reactive-var")
  api.addFiles('shared/punches.js', ['client', 'server']);
  api.addFiles('shared/fields/mapInput.html', ['client']);
  api.addFiles('shared/fields/mapInput.js', ['client', 'server']);
  api.addFiles('server/publish.js', 'server');
  api.addFiles('client/location.js', 'client');
  api.addFiles('client/templates/punch/edit.html', 'client');
  api.addFiles('client/templates/punch/insert.html', 'client');
  api.addFiles('client/templates/punch/list.html', 'client');
  api.addFiles('client/routes/punches.js', 'client');
  api.export('Punches')
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:punches');
  api.mainModule('punches-tests.js');

});
