module.exports = {
  servers: {
    one: {
      host: 'beanscount.co.za',	
      username: 'root',
      password: 'almagest',
      // pem: './mykey',
    },
  },

  meteor: {
    name: 'beanscount',
    path: './app',
    servers: {
      one: {},
    },
    env: {
      PORT: 8000,
      ROOT_URL: 'http://beanscount.co.za',
      MONGO_URL: 'mongodb://localhost/beanscount'
    },
 "deployCheckWaitTime": 120,
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};
