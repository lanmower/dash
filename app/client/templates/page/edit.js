/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.EditPage.helpers({
  onSuccess:function() {
    return function() {
      Router.go('pagesList');
    }
  }
});
