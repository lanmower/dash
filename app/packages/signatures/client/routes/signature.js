Router.route('signature/status/:_id', {
	parent: 'home',
  name: 'signatureStatus',
  waitOn: function() {
  	return [this.subscribe("signatures"),
  	this.subscribe("users")];
  },
  data: function() {
    var signature = Signatures.findOne({_id:this.params._id});
    if(signature) {
    	return {
    		date: signature.updatedAt,
    		signature:signature,
    		users:_.map(signature.users, function(user) {
		    	return Meteor.users.findOne(user);
    		})
    	};
    }
  },
	title: 'Signature Status',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();

		}
});
Router.route('signature/list', {
	parent: 'home',
  name: 'signaturesList',
  waitOn: function() {return this.subscribe("signatures")},
  data: function() {
		return {col:Signatures, fields: ['title', { key: 'buttons', label: '',tmpl: Template.SignaturesListCellButtons}]};
  },
	title: 'List Signatures',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();

		}
});
Router.route('signature/insert', {
	parent: 'signaturesList',
	title: 'Insert Signature',
  name: 'insertSignature',
  where: 'client',
  waitOn: function() {
  	this.subscribe("users")
  },
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])){
				Router.go('/');
			}
			this.next();

		}

});
Router.route('signature/edit/:_id', {
  name: 'editSignature',
	parent: 'signaturesList',
  waitOn: function() {
  	return [this.subscribe("signatures"),
  	this.subscribe("users")]
  },
  data: function() {
    var signature = Signatures.findOne({_id:this.params._id});
    return {signature:signature};
  },
	title: 'Edit Signature',
  fastRender: true,
  where: 'client',
	onBeforeAction: function() {
			if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin', 'signatures-admin'])){
				Router.go('/');
			}
			this.next();

		}

});
