const express = require('express');
const fs = require('fs');
const http = require('http');

/**
 * @param {string} docRoot
 * @returns {Express}
 */
const createApp = function createApp(docRoot) {
  const app = express();

  app.use('/', express.static(fs.realpathSync(docRoot), {
    fallthrough: true,
  }));

  return app;
};

/**
 * @param {string} docRoot
 * @returns {module:http.Server}
 */
const serve = function serve(docRoot) {
  const server = http.createServer();

  server.on('request', createApp(docRoot));
  server.keepAliveTimeout = 10;
  server.listen({
    port: 3000,
    host: 'localhost',
  });

  return server;
};

module.exports.serve = serve;
