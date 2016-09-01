Package.describe({
  name: 'almagest:core',
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
  api.use('mongo');
  api.use('aldeed:autoform');
  api.use('templating', "client"  );
  api.use('reactive-var');
  api.use('momentjs:moment');
  api.use('dburles:collection-helpers');
  api.use('matb33:collection-hooks');
  api.use('aldeed:collection2');
  api.use('check');
  api.mainModule('core.js');

  // Generated with: github.com/philcockfield/meteor-package-paths
  api.addFiles('shared/types.js', ['client', 'server']);
  api.addFiles('shared/schema.js', ['client', 'server']);
  api.addFiles('shared/widgets.js', ['client', 'server']);
  api.addFiles('shared/fields.js', ['client', 'server']);
  api.addFiles('client/lib/bsfix.js', 'client');
  api.addFiles('client/lib/color.js', 'client');
  api.addFiles('client/lib/helpers.js', 'client');
  api.addFiles('client/lib/start.js', 'client');
  api.addFiles('client/lib/utils.js', 'client');
  api.addFiles('client/stylesheets/sidebar.css', 'client');
  api.addFiles('client/stylesheets/main.css', 'client');
  api.export('gong');
  api.export("Widgets");
  api.export("Fields");
  api.export("userIsInRole");
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:core');
  api.mainModule('core-tests.js');

  // Generated with: github.com/philcockfield/meteor-package-paths


});
