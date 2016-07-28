Package.describe({
  name: 'almagest:calendar',
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
  api.use('templating', "client");
  api.use('mongo');
  api.use('reactive-var');
  api.use("iron:router");
  api.use('almagest:core');
  api.use('rzymek:fullcalendar');

  api.mainModule('calendar.js');
  api.addFiles('submissionsCalendar.html', 'client');
  api.addFiles('submissionsCalendar.js', 'client');
  api.addFiles('routes.js', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:currency');
  api.mainModule('currency-tests.js');
});
