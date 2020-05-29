const fs = require('fs');

// Copied from node-ssi and add 'g' flag.
const includeFileReg = /<!--#\s*include\s+(file|virtual)=(['"])([^\r\n\s]+?)\2\s*(.*)-->/g;

/**
 * @param {string} absPath
 * @returns {string[]}
 */
const nextMatches = (absPath) => {
  const content = fs.readFileSync(absPath).toString();

  let result = [];
  let matchResult;
  while ((matchResult = includeFileReg.exec(content))) {
    result.push(matchResult);
  }

  return result;
};

/**
 * @typedef {Object} SSIIncludeAttributeResultSet
 * @property {SSIIncludeAttributeErrorItem[]} error
 */

/**
 * @typedef {Object} SSIIncludeAttributeErrorItem
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
 * @param {string} path
 * @param {string[]} stack
 * @param {SSIIncludeAttributeResultSet} result
 */
const traverseForIncludeAttribute = (rootDir, path, stack, result) => {
  const absPath = rootDir + path;

  const matches = nextMatches(absPath);
  if (matches.length > 0) {
    matches.forEach((match) => {
      const code = match[0];
      const attribute = match[1];
      const next = match[3];

      // Ignore circular inclusion cases.
      if (attribute === 'file') {
        result.error.push({
          path: path,
          code: code,
        });
      } else if (stack.indexOf(next) < 0) {
        stack.push(next);
        traverseForIncludeAttribute(rootDir, next, stack, result);
        stack.pop();
      }
    });
  }
};

/**
 * @param {string} rootDir
 * @param {string} path
 * @param {string[]} stack
 * @param {SSIResultSet} result
 */
const traverse = (rootDir, path, stack, result) => {
  const absPath = rootDir + path;

  const matches = nextMatches(absPath);
  if (matches.length > 0) {
    matches.forEach((match) => {
      const next = match[3];

      if (stack.indexOf(next) >= 0) {
        result.error.push(stack.concat(next));
      } else {
        stack.push(next);
        traverse(rootDir, next, stack, result);
        stack.pop();
      }
    });
  } else {
    result.ok.push(stack.concat(path));
  }
};

/**
 * @param {string} rootDir
 * @param {string} path
 * @returns {SSIIncludeAttributeResultSet}
 */
const checkIncludeAttribute = (rootDir, path) => {
  let result = {error: []};

  traverseForIncludeAttribute(rootDir, path, [path], result);

  return result;
};

/**
 * @param {string} rootDir
 * @param {string} path
 * @returns {SSIResultSet}
 */
const checkCircularInclusion = (rootDir, path) => {
  let result = {ok: [], error: []};

  traverse(rootDir, path, [path], result);

  return result;
};

module.exports.checkIncludeAttribute = checkIncludeAttribute;
module.exports.checkCircularInclusion = checkCircularInclusion;
