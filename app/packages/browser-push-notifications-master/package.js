Package.describe({
  name: 'femiveys:browser-push-notifications',
  version: '0.3.0',
  summary: 'Add browser push notifications. Currently Chrome to android',
  git: 'git@github.com:femiveys/browser-push-notifications.git',
  // documentation: 'README.md'
});

both = ['client', 'server'];

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.1');
  api.use('templating');
  api.use('http');
  api.use('iron:router@1.0.9');
  api.use('mongo');
  api.use('aldeed:simple-schema@1.3.3');
  api.use('mrt:cookies@0.3.0');
  api.use('thepumpinglemma:cookies@1.0.0');
    api.addFiles(
  [
    'lib/both/collections.js',
  ],
  both);

  api.addFiles(
  [
    'lib/client/serviceWorkerRegistration.js',
    'lib/client/subscriptionManager.js',
    'lib/client/views.html',
    'lib/client/views.js',
  ],
  'client');

  api.addFiles(
  [
    'lib/server/collections.js',
    'lib/server/methods.js',
    'lib/server/server.js',
    'lib/server/router.js',
  ],
  'server');
  api.export('bpNotifications');
  api.addFiles('img/check.png', 'client', {isAsset: true});
  api.addFiles('img/error.png', 'client', {isAsset: true});
  api.addFiles('serviceWorker.js', 'client', {isAsset: true});
});

