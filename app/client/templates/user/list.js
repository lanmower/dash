/*****************************************************************************/
Template.UsersList.helpers({
  code:function(_id) {
    Math.seedrandom(_id);
    return ""+parseInt(Math.random()*10)+parseInt(Math.random()*10)+parseInt(Math.random()*10)+parseInt(Math.random()*10);
  }
});
