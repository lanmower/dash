Package.describe({
  name: 'almagest:forms',
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
  api.use('almagest:files');
  api.use("templating", "client");
  api.use('aldeed:autoform');
  api.mainModule('forms.js');

  // Generated with: github.com/philcockfield/meteor-package-paths
  api.addFiles('shared/fields/fileInput/afFileList.html', ['client', 'server']);
  api.addFiles('shared/fields/approveInput/approveForm.html', ['client', 'server']);
  api.addFiles('shared/fields/approveInput/approveInput.html', ['client', 'server']);
  api.addFiles('shared/fields/code/codeField.html', ['client', 'server']);
  api.addFiles('shared/fields/dateRangeInput/dateRangeInput.html', ['client', 'server']);
  api.addFiles('shared/fields/dateTimeInput/dateTimeInput.html', ['client', 'server']);
  api.addFiles('shared/fields/fileUpload/fileUpload.html', ['client', 'server']);
  api.addFiles('shared/fields/formSelectInput/formList.html', ['client', 'server']);
  api.addFiles('shared/fields/html/htmlField.html', ['client', 'server']);
  api.addFiles('shared/fields/leaveInput/leaveInput.html', ['client', 'server']);
  api.addFiles('shared/fields/textInput/textInput.js', ['client', 'server']);
  api.addFiles('shared/fields/fileInput/fileInput.js', ['client', 'server']);
  api.addFiles('shared/fields/approveInput/approvals.js', ['client', 'server']);
  api.addFiles('shared/fields/approveInput/approveInput.js', ['client', 'server']);
  api.addFiles('shared/fields/approveInput/approveNotification.js', ['client', 'server']);
  api.addFiles('shared/fields/approveInput/approveRoute.js', ['client', 'server']);
  api.addFiles('shared/fields/approveInput/approvedList.js', ['client', 'server']);
  api.addFiles('shared/fields/checkboxInput/checkboxInput.js', ['client', 'server']);
  api.addFiles('shared/fields/code/codeField.js', ['client', 'server']);
  api.addFiles('shared/fields/dateInput/dateInput.js', ['client', 'server']);
  api.addFiles('shared/fields/dateRangeInput/dateRangeInput.js', ['client', 'server']);
  api.addFiles('shared/fields/dateTimeInput/dateTimeInput.js', ['client', 'server']);
  api.addFiles('shared/fields/editorInput/editorInput.js', ['client', 'server']);
  api.addFiles('shared/fields/userSelectInput/userSelectInput.js', ['client', 'server']);
  api.addFiles('shared/fields/fileUpload/fileUpload.js', ['client', 'server']);
  api.addFiles('shared/fields/formSelectInput/formSelectInput.js', ['client', 'server']);
  api.addFiles('shared/fields/html/htmlField.js', ['client', 'server']);
  api.addFiles('shared/fields/leaveInput/leaveInput.js', ['client', 'server']);
  api.addFiles('shared/fields/leaveInput/leaveTrigger.js', ['client', 'server']);
  api.addFiles('shared/fields/linkInput/linkInput.js', ['client', 'server']);
  api.addFiles('shared/fields/selectInput/selectInput.js', ['client', 'server']);
  api.addFiles('shared/collections/fields.js', ['client', 'server']);
  api.addFiles('shared/debug.js', ['client', 'server']);
  api.addFiles('server/methods.js', 'server');
  api.addFiles('server/publish.js', 'server');
  api.addFiles('server/start.js', 'server');
  api.addFiles('client/shared/collections/forms.js', ['client', 'server']);
  api.addFiles('client/templates/field/edit/edit.html', 'client');
  api.addFiles('client/templates/field/insert/insert.html', 'client');
  api.addFiles('client/templates/form/submissions/admin.html', 'client');
  api.addFiles('client/templates/form/submissions/submissions.html', 'client');
  api.addFiles('client/templates/form/submissions/submit.html', 'client');
  api.addFiles('client/templates/form/submissions/update.html', 'client');
  api.addFiles('client/templates/form/submissions/updateAdmin.html', 'client');
  api.addFiles('client/templates/form/edit.html', 'client');
  api.addFiles('client/templates/form/insert.html', 'client');
  api.addFiles('client/templates/form/list.html', 'client');
  api.addFiles('client/templates/form/submissions/schema/schema.js', 'client');
  api.addFiles('client/templates/field/edit/edit.js', 'client');
  api.addFiles('client/templates/field/insert/insert.js', 'client');
  api.addFiles('client/templates/form/submissions/admin.js', 'client');
  api.addFiles('client/templates/form/submissions/submissions.js', 'client');
  api.addFiles('client/templates/form/submissions/submit.js', 'client');
  api.addFiles('client/templates/form/submissions/update.js', 'client');
  api.addFiles('client/templates/form/submissions/updateAdmin.js', 'client');
  api.addFiles('client/templates/form/edit.js', 'client');
  api.addFiles('client/templates/form/insert.js', 'client');
  api.addFiles('client/lib/form.js', 'client');
  api.addFiles('client/routes/field.js', 'client');
  api.addFiles('client/routes/form.js', 'client');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('almagest:forms');
  api.mainModule('forms-tests.js');

  // Generated with: github.com/philcockfield/meteor-package-paths
  

});
