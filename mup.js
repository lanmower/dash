module.exports = {
  servers: {
    one: {
      host: 'beanscount.co.za',
      username: 'root',
      // pem:
      password: 'almagest'
      // or leave blank for authenticate from ssh-agent
    }
  },

  meteor: {
    name: 'beanscount',
    path: '/usr/src/dash/app',
    servers: {
      one: {} //list of servers to deploy, from the 'servers' list
    },
    env: {
      ROOT_URL: 'beanscount.co.za',
      MONGO_URL: 'mongodb://localhost/beanscount'
    },
    //logs: { //optional
    //  driver: 'syslog',
    //  opts: {
    //    url:'udp://syslogserverurl.com:1234'
    //  }
    //}
    //dockerImage: 'madushan1000/meteord-test', //optional
    deployCheckWaitTime: 60 //default 10
  },

  mongo: { //optional
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};
