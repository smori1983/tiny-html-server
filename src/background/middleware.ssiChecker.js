const ssiUtil = require('./util.ssi');

/**
 * @param {e.Request} req
 * @returns {boolean}
 */
const canHandle = (req) => {
  return req.method === 'GET';
};

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
    if (!canHandle(req)) {
      next();
      return;
    }

    /** @type {SSIAttributeResultSet} result */
    const result = ssiUtil.checkIncludeAttribute(rootDir, prepareReqPath(req));

    if (result.error.length > 0) {
      res.render('include_attribute.ejs', {
        result: result,
      });
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
    if (!canHandle(req)) {
      next();
      return;
    }

    /** @type {SSIResultSet} result */
    const result = ssiUtil.checkCircularInclusion(rootDir, prepareReqPath(req));

    if (result.error.length > 0) {
      res.render('circular_inclusion.ejs', {
        result: result,
      });
    } else {
      next();
    }
  };
};

module.exports.includeAttribute = includeAttribute;
module.exports.circularInclusion = circularInclusion;
