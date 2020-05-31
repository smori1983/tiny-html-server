/**
 * @param {middlewareCallback} cb
 * @returns {middlewareCallback}
 */
const getOnlyMiddleware = (cb) => {
  return function (req, res, next) {
    if (req.method === 'GET') {
      cb(req, res, next);
    } else {
      next();
    }
  };
};

module.exports.getOnlyMiddleware = getOnlyMiddleware;
