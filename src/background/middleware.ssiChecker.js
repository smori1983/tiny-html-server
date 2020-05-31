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
    /** @type {SSIAttributeResult} result */
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
    /** @type {SSICircularInclusionResult} result */
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

/**
 * @param {string} rootDir
 * @returns {middlewareCallback}
 */
const fileExistence = (rootDir) => {
  return getOnlyMiddleware((req, res, next) => {
    /** @type {SSIFileExistenceResult} result */
    const result = ssiUtil.checkFileExistence(rootDir, prepareReqPath(req));

    if (result.error.length > 0) {
      res.render('file_existence.ejs', {
        result: result,
      })
    } else {
      next();
    }
  });
};

module.exports.includeAttribute = includeAttribute;
module.exports.circularInclusion = circularInclusion;
module.exports.fileExistence = fileExistence;
