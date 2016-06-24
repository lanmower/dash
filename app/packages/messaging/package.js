Package.describe({
  name: 'almagest:messaging',
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
  api.use('templating');
  api.use('ecmascript');
  api.use('mongo');
  api.use('underscore');
  api.use('session');
  api.use('reactive-var');

  api.use('aldeed:autoform');
  api.use("aldeed:delete-button");

  api.mainModule('messaging.js');

  // Generated with: github.com/philcockfield/meteor-package-paths

    api.addFiles('shared/collections/messages.js', ['client', 'server']);
    api.addFiles('server/publish.js', 'server');
  api.addFiles('client/chat/chat.html', ['client']);
  api.addFiles('client/chat/chat.js', ['client']);
  api.addFiles('client/chat/chat.css', ['client']);
  api.addFiles('client/chat/navbar.html', ['client']);
  api.addFiles('client/chat/navbar.js', ['client']);
  api.export('Messages');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:messaging');
  api.mainModule('messaging-tests.js');

  // Generated with: github.com/philcockfield/meteor-package-paths


});
