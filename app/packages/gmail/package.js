Package.describe({
  name: 'almagest:gmail',
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
  api.mainModule('gmail.js');

  // Generated with: github.com/philcockfield/meteor-package-paths
  api.addFiles('server/collections/gmail.js', 'server');
  api.addFiles('server/methods.js', 'server');
  api.addFiles('server/publish.js', 'server');
  api.addFiles('client/templates/mail/labels.html', 'client');
  api.addFiles('client/templates/mail/list.html', 'client');
  api.addFiles('client/templates/mail/messageView.html', 'client');
  api.addFiles('client/templates/mail/messages.html', 'client');
  api.addFiles('client/templates/mail/collections/collection.js', 'client');
  api.addFiles('client/templates/mail/labels.js', 'client');
  api.addFiles('client/templates/mail/messages.js', 'client');
  api.addFiles('client/routes/mail.js', 'client');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:gmail');
  api.mainModule('gmail-tests.js');

  // Generated with: github.com/philcockfield/meteor-package-paths
  

});
