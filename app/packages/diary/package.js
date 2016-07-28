Package.describe({
  name: 'almagest:diary',
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
  api.use("templating", "client");
  api.use("mongo");
  api.use("iron:router");
  api.use("reactive-var")
  api.use('momentjs:moment');

  api.mainModule('diary.js');

  // Generated with: github.com/philcockfield/meteor-package-paths
  api.addFiles('shared/collections/diaries.js', ['client', 'server']);
  api.addFiles('server/publish.js', 'server');
  api.addFiles('client/templates/diary/diaryToday.html', 'client');
  api.addFiles('client/widgets/diary/diary.html', 'client');
  api.addFiles('client/widgets/diary/diaryList.html', 'client');
  api.addFiles('client/widgets/diary/viewDiary.html', 'client');
  api.addFiles('client/widgets/diary/diary.js', 'client');
  api.addFiles('client/widgets/diary/diaryList.js', 'client');
  api.addFiles('client/widgets/diary/viewDiary.js', 'client');
  api.addFiles('client/routes/diary.js', 'client');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:diary');
  api.mainModule('diary-tests.js');

  // Generated with: github.com/philcockfield/meteor-package-paths


});
