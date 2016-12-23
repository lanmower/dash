Package.describe({
  name: 'almagest:tasks',
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

  api.mainModule('tasks.js');

  // Generated with: github.com/philcockfield/meteor-package-paths
  api.addFiles('shared/tasks.js', ['client', 'server']);
  api.addFiles('server/publish.js', 'server');
  api.addFiles('client/templates/task/edit.html', 'client');
  api.addFiles('client/templates/task/insert.html', 'client');
  api.addFiles('client/templates/task/list.html', 'client');
  api.addFiles('client/templates/task/list.js', 'client');
  api.addFiles('client/routes/task.js', 'client');
  api.export('Tasks')
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:tasks');
  api.mainModule('tasks-tests.js');

  // Generated with: github.com/philcockfield/meteor-package-paths


});
