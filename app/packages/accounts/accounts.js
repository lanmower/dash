// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See accounts-tests.js for an example of importing.
export const name = 'accounts';

AccountsTemplates.configure({
	socialLoginStyle: "redirect"
});

AccountsTemplates.addField({
    _id: 'name',
    type: 'text',
    displayName: "Full Name",
    required: true
});
