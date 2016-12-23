
Template.TasksList.helpers({
    flipDone: function() {
        return Router.current().params.done!='true'?true:false
    },
    done: function() {
        return !(Router.current().params.done=='true');
    }
});
Template.TasksListCellButtons.helpers({
    done: function() {
        return !(Router.current().params.done=='true');
    }
});
