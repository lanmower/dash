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
  //api.versionsFrom('1.3.2.4');
  api.use('underscore');
  api.use("templating", "client");
  api.use('aldeed:autoform');
  api.use('mongo');
  api.use('ecmascript');
  api.use('reactive-var');
  api.use('iron:router');
  api.use('almagest:core');
  api.mainModule('pages.js');

  // Generated with: github.com/philcockfield/meteor-package-paths
  api.addFiles('shared/collections/schema/widgets.js', ['client', 'server']);
  api.addFiles('shared/collections/pages.js', ['client', 'server']);
  api.addFiles('shared/collections/widgets.js', ['client', 'server']);
  api.addFiles('server/publish.js', 'server');
  api.addFiles('client/templates/widget/edit/edit.html', 'client');
  api.addFiles('client/templates/widget/insert/insert.html', 'client');
  api.addFiles('client/templates/home/home.html', 'client');
  api.addFiles('client/templates/page/edit.html', 'client');
  api.addFiles('client/templates/page/insert.html', 'client');
  api.addFiles('client/templates/page/list.html', 'client');
  api.addFiles('client/templates/page/view.html', 'client');
  api.addFiles('client/widgets/announcement/announcement.html', 'client');
  api.addFiles('client/widgets/embed/embed.html', 'client');
  api.addFiles('client/widgets/mediaSearch/mediaSearch.html', 'client');
  api.addFiles('client/widgets/player/player.html', 'client');
  api.addFiles('client/widgets/userCode/userCode.html', 'client');
  api.addFiles('client/templates/widget/edit/edit.js', 'client');
  api.addFiles('client/templates/widget/insert/insert.js', 'client');
  api.addFiles('client/templates/home/home.css', 'client');
  api.addFiles('client/templates/home/home.js', 'client');
  api.addFiles('client/templates/page/edit.js', 'client');
  api.addFiles('client/templates/page/insert.js', 'client');
  api.addFiles('client/widgets/announcement/announcement.js', 'client');
  api.addFiles('client/widgets/embed/embed.js', 'client');
  api.addFiles('client/widgets/mediaSearch/mediaSearch.js', 'client');
  api.addFiles('client/widgets/player/player.css', 'client');
  api.addFiles('client/widgets/player/player.js', 'client');
  api.addFiles('client/widgets/userCode/userCode.js', 'client');
  api.addFiles('client/routes/home.js', 'client');
  api.addFiles('client/routes/page.js', 'client');
  api.addFiles('client/routes/widget.js', 'client');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:pages');
  api.mainModule('pages-tests.js');

  // Generated with: github.com/philcockfield/meteor-package-paths


});
