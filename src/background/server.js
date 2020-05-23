const express = require('express');
const fs = require('fs');
const http = require('http');

/**
 * @param {string} docRoot
 * @returns {Express}
 */
const createApp = (docRoot) => {
  const app = express();

  app.use('/', express.static(fs.realpathSync(docRoot), {
    fallthrough: true,
  }));

  return app;
};

/**
 * @typedef {Object} ServerResponseSuccess
 * @property {module:http.Server} server
 */

/**
 * @typedef {Object} ServerResponseFailure
 * @property {string} code
 * @property {string} message
 */

/**
 * @callback ServerResponseCallback
 * @param {string} status
 * @param {(ServerResponseSuccess|ServerResponseFailure)} data
 */

/**
 * @param {string} docRoot
 * @param {number} port
 * @param {ServerResponseCallback} cb
 */
const serve = (docRoot, port, cb) => {
  const server = http.createServer();

  server.keepAliveTimeout = 10;
  server.on('request', createApp(docRoot));
  server.on('error', (e) => {
    cb('error', {
      code: e.code,
      message: e.message,
    });
  });
  server.listen({
    port: port,
    host: 'localhost',
  }, () => {
    cb('ok', {
      server: server,
    });
  });
};

module.exports.serve = serve;
