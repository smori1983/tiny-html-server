const getOnlyMiddleware = require('./util.middleware').getOnlyMiddleware;
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
  return getOnlyMiddleware((req, res, next) => {
    /** @type {SSIAttributeResultSet} result */
    const result = ssiUtil.checkIncludeAttribute(rootDir, prepareReqPath(req));

    if (result.error.length > 0) {
      res.render('include_attribute.ejs', {
        result: result,
      });
    } else {
      next();
    }
  });
};

/**
 * @param {string} rootDir
 * @returns {middlewareCallback}
 */
const circularInclusion = (rootDir) => {
  return getOnlyMiddleware((req, res, next) => {
    /** @type {SSIResultSet} result */
    const result = ssiUtil.checkCircularInclusion(rootDir, prepareReqPath(req));

    if (result.error.length > 0) {
      res.render('circular_inclusion.ejs', {
        result: result,
      });
    } else {
      next();
    }
  });
};

module.exports.includeAttribute = includeAttribute;
module.exports.circularInclusion = circularInclusion;
