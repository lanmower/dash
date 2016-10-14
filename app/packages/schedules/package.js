Package.describe({
  name: 'almagest:schedules',
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
  api.use('momentjs:moment');

  api.mainModule('schedules.js');

  // Generated with: github.com/philcockfield/meteor-package-paths
  api.addFiles('shared/schedules.js', ['client', 'server']);
  api.addFiles('server/publish.js', 'server');
  api.addFiles('client/templates/schedule/edit.html', 'client');
  api.addFiles('client/templates/schedule/insert.html', 'client');
  api.addFiles('client/templates/schedule/list.html', 'client');
  api.addFiles('client/routes/schedule.js', 'client');
  api.export('Schedules');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:schedules');
  api.mainModule('schedules-tests.js');

  // Generated with: github.com/philcockfield/meteor-package-paths


});
