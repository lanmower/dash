module.exports = {
  servers: {
    one: {
      host: '<servername>',	
      username: '<ssh username>',
      password: '<ssh password>',
      // pem: './mykey',
    },
  },

  meteor: {
    name: '<projectname>',
    path: './app',
    servers: {
      one: {},
    },
    env: {
      PORT: 8000,
      ROOT_URL: 'http://<projectname>',
      MONGO_URL: 'mongodb://localhost/<projectname>'
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
