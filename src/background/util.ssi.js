const fs = require('fs');
const path = require('path');

// Copied from node-ssi and add 'g' flag.
const includeFileReg = /<!--#\s*include\s+(file|virtual)=(['"])([^\r\n\s]+?)\2\s*(.*)-->/g;

/**
 * @typedef {Object} SSIMatchedItem
 * @property {string} code
 * @property {string} attribute
 * @property {string} path
 */

/**
 * @param {string} absPath
 * @returns {SSIMatchedItem[]}
 */
const nextMatches = (absPath) => {
  const content = fs.readFileSync(absPath).toString();

  /** @type {SSIMatchedItem[]} result */
  let result = [];
  let matchResult;
  while ((matchResult = includeFileReg.exec(content))) {
    result.push({
      code: matchResult[0],
      attribute: matchResult[1],
      path: matchResult[3],
    });
  }

  return result;
};

/**
 * @param {string} reqPath
 * @param {string} includePath
 * @returns {string}
 */
const resolveIncludePath = (reqPath, includePath) => {
  if (/^\//.test(includePath)) {
    return includePath;
  } else {
    return path.resolve(path.dirname(reqPath), includePath);
  }
};

/**
 * @param {string} rootDir
 * @param {string} path
 * @returns {boolean}
 */
const isExistingFile = (rootDir, path) => {
  try {
    fs.statSync(rootDir + path);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * @typedef {Object} SSIAttributeResultSet
 * @property {SSIAttributeErrorItem[]} error
 */

/**
 * @typedef {Object} SSIAttributeErrorItem
 * @property {string} path
 * @property {string} code
 */

/**
 * @typedef SSIResultSet
 * @property {string[][]} ok
 * @property {string[][]} error
 */

/**
 * @param {string} rootDir
 * @param {string} reqPath
 * @param {string[]} stack
 * @param {SSIAttributeResultSet} result
 */
const traverseForIncludeAttribute = (rootDir, reqPath, stack, result) => {
  const absPath = rootDir + reqPath;
  const matches = nextMatches(absPath);

  if (matches.length > 0) {
    matches.forEach((match) => {
      const next = resolveIncludePath(reqPath, match.path);

      // Ignore circular inclusion cases.
      if (match.attribute === 'file') {
        result.error.push({
          path: reqPath,
          code: match.code,
        });
      } else if (isExistingFile(rootDir, next) && stack.indexOf(next) < 0) {
        stack.push(next);
        traverseForIncludeAttribute(rootDir, next, stack, result);
        stack.pop();
      }
    });
  }
};

/**
 * @param {string} rootDir
 * @param {string} reqPath
 * @param {string[]} stack
 * @param {SSIResultSet} result
 */
const traverseForCircularInclusion = (rootDir, reqPath, stack, result) => {
  const absPath = rootDir + reqPath;
  const matches = nextMatches(absPath);

  if (matches.length > 0) {
    matches.forEach((match) => {
      const next = resolveIncludePath(reqPath, match.path);

      if (stack.indexOf(next) >= 0) {
        result.error.push(stack.concat(next));
      } else if (isExistingFile(rootDir, next)) {
        stack.push(next);
        traverseForCircularInclusion(rootDir, next, stack, result);
        stack.pop();
      }
    });
  } else {
    result.ok.push(stack.concat(reqPath));
  }
};

/**
 * @param {string} reqPath
 * @returns {boolean}
 */
const canHandle = (reqPath) => {
  return /\.html$/.test(reqPath);
};

/**
 * @param {string} rootDir
 * @param {string} reqPath
 * @returns {SSIAttributeResultSet}
 */
const checkIncludeAttribute = (rootDir, reqPath) => {
  let result = {error: []};

  if (canHandle(reqPath)) {
    traverseForIncludeAttribute(rootDir, reqPath, [reqPath], result);
  }

  return result;
};

/**
 * @param {string} rootDir
 * @param {string} reqPath
 * @returns {SSIResultSet}
 */
const checkCircularInclusion = (rootDir, reqPath) => {
  let result = {ok: [], error: []};

  if (canHandle(reqPath)) {
    traverseForCircularInclusion(rootDir, reqPath, [reqPath], result);
  }

  return result;
};

module.exports.checkIncludeAttribute = checkIncludeAttribute;
module.exports.checkCircularInclusion = checkCircularInclusion;
