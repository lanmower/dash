Router.configure({
	layoutTemplate: "MasterLayout",
	notFoundTemplate: "NotFound",
});

Router.route('/', {
  name: 'home',
  controller: 'HomeController',
  where: 'client',
  fastRender: true,
	title: 'Home'
});

T9n.setLanguage('en');

// Options
AccountsTemplates.configure({
    defaultLayout: 'emptyLayout',
    showForgotPasswordLink: true,
    overrideLoginErrors: true,
    enablePasswordChange: true,
    sendVerificationEmail: false,
		focusFirstInput: true,

    enforceEmailVerification: true,
    confirmPassword: true,
    //continuousValidation: false,
    //displayFormLabels: true,
    //forbidClientAccountCreation: false,
    //formValidationFeedback: true,
    //homeRoutePath: '/',
    //showAddRemoveServices: false,
    //showPlaceholders: true,
		socialLoginStyle: "redirect",
		//forceApprovalPrompt: true,
    negativeValidation: true,
    positiveValidation:true,
    negativeFeedback: false,
    positiveFeedback:true,

    // Privacy Policy and Terms of Use
    //privacyUrl: 'privacy',
    //termsUrl: 'terms-of-use',
});
//Routes
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');

// Protect all Routes
Router.plugin('ensureSignedIn');
