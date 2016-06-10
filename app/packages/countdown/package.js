Package.describe({
  name: 'almagest:countdown',
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
  api.use('templating', "client"  );
  api.use('almagest:pages');

  api.mainModule('countdown.js');

  // Generated with: github.com/philcockfield/meteor-package-paths
  api.addFiles('client/widgets/countdown/countdown.html', 'client');
  api.addFiles('client/widgets/countdown/countdown.js', 'client');
  api.addFiles('client/lib/flipclock.css', 'client');
  api.addFiles('client/lib/flipclock.js', 'client');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:countdown');
  api.mainModule('countdown-tests.js');

  // Generated with: github.com/philcockfield/meteor-package-paths


});
