Hooks.onLoggedOut = function (userId) {
  console.log("log out hook");
  Events.insert({event:"logout",userId:userId,time:new Date()});
}
