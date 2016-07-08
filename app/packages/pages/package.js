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
  api.versionsFrom("1.3.2.4")
  api.use('ecmascript');
  api.use('underscore');
  api.use("templating", "client");
  api.use('mongo');
  api.use('accounts-base');
  api.use("iron:router");
  api.use('almagest:core');
  api.use('almagest:menus');
  api.use('almagest:messaging');
  api.use('almagest:files');
  api.use('aldeed:autoform');
  api.use("aldeed:delete-button");
  api.use('mrt:jquery-ui-sortable');
  api.use('monbro:iron-router-breadcrumb');

  api.use('aldeed:collection2');
  api.use('matb33:collection-hooks');
  api.use('reywood:publish-composite');
  api.use('reactive-var');
  api.use('iron:router');
  api.use('mpowaga:autoform-summernote');
  api.use("vazco:universe-autoform-select");
  api.use('dburles:collection-helpers');
  api.use('jrudio:videojs');

  // Generated with: github.com/philcockfield/meteor-package-paths
  api.addFiles('shared/collections/pages.js', ['client', 'server']);
  api.addFiles('client/widgets/player/player.css', 'client');
  api.addFiles('client/widgets/player/player.html', 'client');
  api.addFiles('client/widgets/player/player.js', 'client');
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
  api.addFiles('client/widgets/userCode/userCode.js', 'client');
  api.addFiles('client/routes/home.js', 'client');
  api.addFiles('client/routes/page.js', 'client');
  api.addFiles('client/routes/widget.js', 'client');
  api.addFiles('client/templates/shared/loading/loading.html', ['client']);
  api.addFiles('client/templates/shared/not_found/not_found.html', ['client']);
  api.addFiles('client/templates/layouts/master_layout/contents.html', 'client');
  api.addFiles('client/templates/layouts/master_layout/empty_layout.html', 'client');
  api.addFiles('client/templates/layouts/master_layout/master_layout.html', 'client');
  api.addFiles('client/templates/access_denied/access_denied.html', 'client');
  api.addFiles('client/templates/layouts/master_layout/contents.js', 'client');
  api.addFiles('client/templates/layouts/master_layout/master_layout.css', 'client');
  api.addFiles('client/templates/layouts/master_layout/master_layout.js', 'client');
  api.addFiles('client/templates/access_denied/access_denied.css', 'client');
  api.addFiles('client/templates/access_denied/access_denied.js', 'client');

  api.mainModule('pages.js');
  api.export("Pages");

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:pages');
  api.mainModule('pages-tests.js');

  // Generated with: github.com/philcockfield/meteor-package-paths


});
