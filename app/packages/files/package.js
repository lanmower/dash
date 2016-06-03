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
  api.versionsFrom('1.3.2.4');
  api.use('ecmascript');
  api.mainModule('files.js');

  // Generated with: github.com/philcockfield/meteor-package-paths
  api.addFiles('shared/files.js', ['client', 'server']);
  api.addFiles('client/templates/file/edit.html', 'client');
  api.addFiles('client/routes/file.js', 'client');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:files');
  api.mainModule('files-tests.js');

  // Generated with: github.com/philcockfield/meteor-package-paths
  

});
