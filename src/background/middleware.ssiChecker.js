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

    /** @type {SSIResultSet} result */
    const result = ssiUtil(rootDir, path);

    if (result.error.length > 0) {
      let errorMessage = '<div>Error, SSI circular inclusion:</div>';
      result.error.forEach((errorCase) => {
        errorMessage += '<div>' + errorCase.join(' -> ');
      });
      res.send(errorMessage);
    } else {
      next();
    }
  };
};

module.exports = main;
