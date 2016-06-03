Package.describe({
  name: 'almagest:menus',
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
  api.mainModule('menus.js');

  // Generated with: github.com/philcockfield/meteor-package-paths
  api.addFiles('C:\dev\dashboard\app\packages\menus\shared\menus.js', ['client', 'server']);
  api.addFiles('C:\dev\dashboard\app\packages\menus\client\routes\menu.js', ['client', 'server']);

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:menus');
  api.mainModule('menus-tests.js');

  // Generated with: github.com/philcockfield/meteor-package-paths
  

});
