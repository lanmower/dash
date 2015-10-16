// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.almagest.coas',
  name: 'Coastal Accounting',
  description: 'Coastal Accounting Dashboard',
  author: 'Almagest Fraternite',
  email: 'almagestfraternite@gmail.com',
  website: 'http://almagestfraternite.com'
});

App.icons({
  'iphone': 'icons/icon-60.png',
  'iphone_2x': 'icons/icon-60@2x.png',
  'ipad': 'icons/icon-72.png',
  'ipad_2x': 'icons/icon-72@2x.png'
});

App.launchScreens({
  'iphone': 'splash/Default~iphone.png',
  'iphone_2x': 'splash/Default@2x~iphone.png',
  'iphone5': 'splash/Default-568h@2x~iphone.png',
  'ipad_portrait': 'splash/Default-Portrait~ipad.png',
  'ipad_portrait_2x': 'splash/Default-Portrait@2x~ipad.png',
  'ipad_landscape': 'splash/Default-Landscape~ipad.png',
  'ipad_landscape_2x': 'splash/Default-Landscape@2x~ipad.png'
});

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
