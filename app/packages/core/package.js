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
  api.versionsFrom('1.3.2.4');
  api.use('ecmascript');
  api.mainModule('core.js');
  api.use('aldeed:autoform');

  // Generated with: github.com/philcockfield/meteor-package-paths
  api.addFiles('shared/collections/schema/types/types.js', ['client', 'server']);
  api.addFiles('shared/collections/schema/schema.js', ['client', 'server']);
  api.addFiles('server/publish-additions.js', 'server');
  api.addFiles('client/templates/shared/loading/loading.html', ['client', 'server']);
  api.addFiles('client/templates/shared/not_found/not_found.html', ['client', 'server']);
  api.addFiles('client/templates/layouts/master_layout/navbar/messages/navbar-messages.html', 'client');
  api.addFiles('client/templates/layouts/master_layout/navbar/notes/navbar-notes.html', 'client');
  api.addFiles('client/templates/layouts/master_layout/navbar/uploads/navbar-uploads.html', 'client');
  api.addFiles('client/templates/layouts/master_layout/navbar/users/navbar-users.html', 'client');
  api.addFiles('client/templates/layouts/master_layout/contents.html', 'client');
  api.addFiles('client/templates/layouts/master_layout/empty_layout.html', 'client');
  api.addFiles('client/templates/layouts/master_layout/master_layout.html', 'client');
  api.addFiles('client/templates/layouts/master_layout/menus.html', 'client');
  api.addFiles('client/templates/access_denied/access_denied.html', 'client');
  api.addFiles('client/templates/layouts/master_layout/navbar/messages/navbar-messages.js', 'client');
  api.addFiles('client/templates/layouts/master_layout/navbar/notes/navbar-notes.js', 'client');
  api.addFiles('client/templates/layouts/master_layout/navbar/uploads/navbar-uploads.js', 'client');
  api.addFiles('client/templates/layouts/master_layout/navbar/users/navbar-users.js', 'client');
  api.addFiles('client/templates/layouts/master_layout/contents.js', 'client');
  api.addFiles('client/templates/layouts/master_layout/master_layout.css', 'client');
  api.addFiles('client/templates/layouts/master_layout/master_layout.js', 'client');
  api.addFiles('client/templates/layouts/master_layout/menus.js', 'client');
  api.addFiles('client/templates/access_denied/access_denied.css', 'client');
  api.addFiles('client/templates/access_denied/access_denied.js', 'client');
  api.addFiles('client/lib/bsfix.js', 'client');
  api.addFiles('client/lib/color.js', 'client');
  api.addFiles('client/lib/helpers.js', 'client');
  api.addFiles('client/lib/start.js', 'client');
  api.addFiles('client/lib/utils.js', 'client');
  api.addFiles('client/stylesheets/sidebar.css', 'client');
  api.addFiles('client/stylesheets/main.css', 'client');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:core');
  api.mainModule('core-tests.js');

  // Generated with: github.com/philcockfield/meteor-package-paths
  

});
