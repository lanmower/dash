Package.describe({
  name: 'almagest:files',
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
  api.use('templating', "client");
  api.use("iron:router");
  api.use('udondan:slick');
  api.use('aldeed:autoform');
  api.use("aldeed:delete-button");
  api.use('reactive-var');
  api.use('almagest:core');
  api.use('almagest:forms');
  api.use('cfs:autoform');
  api.use('cfs:ui');
  api.use('cfs:filesystem');
  api.use('cfs:graphicsmagick');
  api.use('cfs:power-queue');

  api.mainModule('files.js');

  // Generated with: github.com/philcockfield/meteor-package-paths
  api.addFiles('shared/files.js', ['server', 'client']);
  api.addFiles('server/publish.js', 'server');
  //api.addFiles('client/files.js', ['client']);
  api.addFiles('client/templates/file/edit.html', 'client');
  api.addFiles('shared/fields/fileUpload/fileUpload.html', ['client']);
  api.addFiles('shared/fields/fileUpload/fileUpload.js', ['client', 'server']);
  api.addFiles('client/templates/layouts/navbar/uploads/navbar-uploads.html', 'client');
  api.addFiles('client/templates/layouts/navbar/uploads/navbar-uploads.js', 'client');

  api.export('Files');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.mainModule('files-tests.js');

  // Generated with: github.com/philcockfield/meteor-package-paths


});
