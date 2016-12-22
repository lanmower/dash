Hooks.onLoggedOut = function(userId) {
    Events.insert({
        event: "logout",
        userId: userId,
        time: new Date()
    });
}
