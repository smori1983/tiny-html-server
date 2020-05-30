const escape = require('escape-html');
const sprintf = require('sprintf-js').sprintf;
const ssiUtil = require('./util.ssi');

/**
 * @param {e.Request} req
 * @returns {string}
 */
const prepareReqPath = (req) => {
  let result = req.path;

  if (/\/$/.test(result)) {
    result += 'index.html';
  }

  return result;
};

/**
 * @param {string} rootDir
 * @returns {middlewareCallback}
 */
const includeAttribute = (rootDir) => {
  return function (req, res, next) {
    if (req.method !== 'GET') {
      next();
      return;
    }

    /** @type {SSIAttributeResultSet} resultAttribute */
    const resultAttribute = ssiUtil.checkIncludeAttribute(rootDir, prepareReqPath(req));

    if (resultAttribute.error.length > 0) {
      let errorMessage = sprintf('<div>%s</div>', escape('Error, \'file\' attribute is not supported for SSI:'));
      resultAttribute.error.forEach((errorCase) => {
        errorMessage += sprintf('<div>%s (%s)</div>', escape(errorCase.path), escape(errorCase.code));
      });

      res.send(errorMessage);
    } else {
      next();
    }
  };
};

/**
 * @param {string} rootDir
 * @returns {middlewareCallback}
 */
const circularInclusion = (rootDir) => {
  return function (req, res, next) {
    if (req.method !== 'GET') {
      next();
      return;
    }

    /** @type {SSIResultSet} result */
    const result = ssiUtil.checkCircularInclusion(rootDir, prepareReqPath(req));

    if (result.error.length > 0) {
      let errorMessage = sprintf('<div>%s</div>', escape('Error, SSI circular inclusion:'));
      result.error.forEach((errorCase) => {
        errorMessage += sprintf('<div>%s</div>', escape(errorCase.join(' -> ')));
      });

      res.send(errorMessage);
    } else {
      next();
    }
  };
};

module.exports.includeAttribute = includeAttribute;
module.exports.circularInclusion = circularInclusion;
