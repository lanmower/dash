Package.describe({
  name: 'almagest:signatures',
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
  api.use('ecmascript');
  api.use('mongo');
  api.use('alanning:roles');
  api.use('templating', "client");
  api.use("iron:router");
  api.use('aslagle:reactive-table');
  api.use('almagest:core');
  api.use('aldeed:autoform');
  api.use("aldeed:delete-button");
  api.use("vazco:universe-autoform-select");
  api.use('aldeed:collection2');
  api.use('underscore');
  //api.use('blaze-html-templates', "client");
  api.addFiles('client/routes/signature.js', 'client');

  api.addFiles('client/templates/signature/edit.html', 'client');
  api.addFiles('client/templates/signature/edit.js', 'client');
  api.addFiles('client/templates/signature/insert.html', 'client');
  api.addFiles('client/templates/signature/hooks.js', 'client');
  api.addFiles('client/templates/signature/list.html', 'client');
  api.addFiles('client/templates/signature/status.html', 'client');
  api.addFiles('client/templates/signature/status.js', 'client');
  api.addFiles('shared/collections/signatures.js', ['server', 'client']);
  api.addFiles('server/methods.js', 'server');
  api.addFiles('server/publish.js', 'server');
  api.mainModule('signatures.js');
  api.export('Signatures');

  // Generated with: github.com/philcockfield/meteor-package-paths
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.mainModule('accounts-tests.js');

  // Generated with: github.com/philcockfield/meteor-package-paths


});
