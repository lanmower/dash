Template.SignatureStatus.helpers({
   isNewer: function(date1, date2) {
       return date1>date2?'alert-warning':'alert-info';
   }
});