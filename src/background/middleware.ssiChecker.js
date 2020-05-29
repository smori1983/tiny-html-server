const escape = require('escape-html');
const sprintf = require('sprintf-js').sprintf;
const ssiUtil = require('./util.ssi');

/**
 * @param {string} rootDir
 * @returns {function}
 */
const main = (rootDir) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      next();
      return;
    }

    let reqPath = req.path;
    if (/\/$/.test(reqPath)) {
      reqPath += 'index.html';
    }

    if (!/\.html$/.test(reqPath)) {
      next();
      return;
    }

    /** @type {SSIIncludeAttributeResultSet} resultAttribute */
    const resultAttribute = ssiUtil.checkIncludeAttribute(rootDir, reqPath);

    if (resultAttribute.error.length > 0) {
      let errorMessage = sprintf('<div>%s</div>', escape('Error, \'file\' attribute is not supported for SSI:'));
      resultAttribute.error.forEach((errorCase) => {
        errorMessage += sprintf('<div>%s (%s)</div>', escape(errorCase.path), escape(errorCase.code));
      });

      res.send(errorMessage);
      return;
    }

    /** @type {SSIResultSet} result */
    const result = ssiUtil.checkCircularInclusion(rootDir, reqPath);

    if (result.error.length > 0) {
      let errorMessage = sprintf('<div>%s</div>', escape('Error, SSI circular inclusion:'));
      result.error.forEach((errorCase) => {
        errorMessage += sprintf('<div>%s</div>', escape(errorCase.join(' -> ')));
      });

      res.send(errorMessage);
      return;
    }

    next();
  };
};

module.exports = main;
