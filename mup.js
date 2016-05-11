module.exports = {
  servers: {
    one: {
      host: 'localelcoin.dedicated.co.za',	
      username: 'root',
      password: 'almagest',
      // pem: './mykey',
    },
  },

  meteor: {
    name: 'localelcoin',
    path: './app',
    servers: {
      one: {},
    },
    env: {
      PORT: 8000,
      ROOT_URL: 'http://localelcoin.dedicated.co.za',
      MONGO_URL: 'mongodb://localhost/localelcoin'
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
