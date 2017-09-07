Package.describe({
  name: 'almagest:accounts',
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
  api.use("templating", "client"  );
  api.use("iron:router");
  api.use("aldeed:delete-button");
  api.use('aslagle:reactive-table');
  api.use('useraccounts:iron-routing');
  api.use('useraccounts:bootstrap');
  api.use('mizzao:user-status');
  api.use('aldeed:autoform');
  api.use('cfs:autoform');
  api.use('differential:event-hooks');
  api.use('matb33:collection-hooks');
  api.mainModule('accounts.js');
  api.use('almagest:signatures');
  api.use('almagest:core');
  api.use('almagest:files');
  api.use("percolate:google-api");
  //api.use('blaze-html-templates', "client");

  // Generated with: github.com/philcockfield/meteor-package-paths
  api.addFiles('client/components/callable.html', 'client');
  api.addFiles('client/components/callable.js', 'client');
  api.addFiles('server/users.js', 'server');
  api.addFiles('server/methods.js', 'server');
  api.addFiles('shared/collections/events.js', ['client', 'server']);
  api.addFiles('shared/collections/roles.js', ['client', 'server']);
  api.addFiles('shared/collections/users.js', ['client', 'server']);
  api.addFiles('server/login.js', 'server');
  api.addFiles('server/logout.js', 'server');
  api.addFiles('server/publish.js', 'server');
  api.addFiles('client/templates/role/edit.html', 'client');
  api.addFiles('client/templates/role/insert.html', 'client');
  api.addFiles('client/templates/role/list.html', 'client');
  api.addFiles('client/templates/user/edit.html', 'client');
  api.addFiles('client/templates/user/list.html', 'client');
  api.addFiles('client/accounts/form.html', 'client');
  api.addFiles('client/templates/user/list.js', 'client');
  api.addFiles('client/collections/user.js', 'client');
  api.addFiles('client/lib/seedrandom.js', 'client');
  api.addFiles('client/routes/accounts.js', 'client');
  api.addFiles('client/routes/role.js', 'client');
  api.addFiles('client/routes/user.js', 'client');
  api.export('Roles');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:accounts');
  api.mainModule('accounts-tests.js');

  // Generated with: github.com/philcockfield/meteor-package-paths


});
