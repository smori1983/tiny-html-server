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

    let path = req.path;
    if (/\/$/.test(path)) {
      path += 'index.html';
    }

    if (!/\.html$/.test(path)) {
      next();
      return;
    }

    /** @type {SSIIncludeAttributeResultSet} resultAttribute */
    const resultAttribute = ssiUtil.checkIncludeAttribute(rootDir, path);

    if (resultAttribute.error.length > 0) {
      let errorMessage = sprintf('<div>%s</div>', escape('Error, \'file\' attribute is not supported for SSI:'));
      resultAttribute.error.forEach((errorCase) => {
        errorMessage += sprintf('<div>%s (%s)</div>', escape(errorCase.path), escape(errorCase.code));
      });

      res.send(errorMessage);
      return;
    }

    /** @type {SSIResultSet} result */
    const result = ssiUtil.checkCircularInclusion(rootDir, path);

    if (result.error.length === 0) {
      next();
      return;
    }

    let errorMessage = '<div>Error, SSI circular inclusion:</div>';
    result.error.forEach((errorCase) => {
      errorMessage += '<div>' + errorCase.join(' -> ') + '</div>';
    });
    res.send(errorMessage);
  };
};

module.exports = main;
