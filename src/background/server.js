const express = require('express');
const fs = require('fs');
const http = require('http');
const connectSSI = require('connect-ssi');
const ssiChecker = require('./middleware.ssiChecker');

/**
 * @callback middlewareCallback
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */

/**
 * @param {string} docRoot
 * @returns {Express}
 */
const createApp = (docRoot) => {
  const app = express();

  const docRootAbsPath = fs.realpathSync(docRoot);

  app.set('views', fs.realpathSync(__dirname + '/templates'));
  app.set('view engine', 'ejs');

  app.use(ssiChecker.includeAttribute(docRootAbsPath));
  app.use(ssiChecker.circularInclusion(docRootAbsPath));
  app.use(ssiChecker.fileExistence(docRootAbsPath));

  // NOTE
  // The option 'ext' is not the extension of included files.
  // This is the default extension of express.static (DirectoryIndex).
  app.use(connectSSI({
    baseDir: docRootAbsPath,
    ext: '.html',
  }));

  app.use('/', express.static(docRootAbsPath, {
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
