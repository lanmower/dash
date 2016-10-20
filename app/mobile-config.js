// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'beanscount.co.za',
  name: 'Coastal Accounting',
  description: 'Coastal Accounting Dashboard',
  author: 'Almagest Fraternite',
  email: 'almagestfraternite@gmail.com',
  website: 'http://almagestfraternite.com'
});

App.icons({
});

App.launchScreens({
});

App.configurePlugin('phonegap-plugin-push', {
  SENDER_ID: 669341428356
});