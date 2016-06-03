Package.describe({
  name: 'almagest:pages',
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
  api.mainModule('pages.js');
  api.use("templating", "client");
  api.use('aldeed:autoform');

  // Generated with: github.com/philcockfield/meteor-package-paths
  api.addFiles('C:\dev\dashboard\app\packages\pages\shared\collections\pages.js', ['client', 'server']);
  api.addFiles('C:\dev\dashboard\app\packages\pages\shared\collections\widgets.js', ['client', 'server']);
  api.addFiles('C:\dev\dashboard\app\packages\pages\client\templates\page\edit.html', ['client', 'server']);
  api.addFiles('C:\dev\dashboard\app\packages\pages\client\templates\page\insert.html', ['client', 'server']);
  api.addFiles('C:\dev\dashboard\app\packages\pages\client\templates\page\list.html', ['client', 'server']);
  api.addFiles('C:\dev\dashboard\app\packages\pages\client\templates\page\view.html', ['client', 'server']);
  api.addFiles('C:\dev\dashboard\app\packages\pages\client\templates\widget\edit\edit.html', ['client', 'server']);
  api.addFiles('C:\dev\dashboard\app\packages\pages\client\templates\widget\insert\insert.html', ['client', 'server']);
  api.addFiles('C:\dev\dashboard\app\packages\pages\client\routes\home.js', ['client', 'server']);
  api.addFiles('C:\dev\dashboard\app\packages\pages\client\routes\page.js', ['client', 'server']);
  api.addFiles('C:\dev\dashboard\app\packages\pages\client\routes\widget.js', ['client', 'server']);
  api.addFiles('C:\dev\dashboard\app\packages\pages\client\templates\page\edit.js', ['client', 'server']);
  api.addFiles('C:\dev\dashboard\app\packages\pages\client\templates\page\insert.js', ['client', 'server']);
  api.addFiles('C:\dev\dashboard\app\packages\pages\client\templates\widget\edit\edit.js', ['client', 'server']);
  api.addFiles('C:\dev\dashboard\app\packages\pages\client\templates\widget\insert\insert.js', ['client', 'server']);

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:pages');
  api.mainModule('pages-tests.js');

  // Generated with: github.com/philcockfield/meteor-package-paths


});
