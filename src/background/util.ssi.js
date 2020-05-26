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
 * @typedef SSIResultSet
 * @property {string[][]} ok
 * @property {string[][]} error
 */

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

const main = (rootDir, path) => {
  let result = {ok: [], error: []};

  traverse(rootDir, path, [path], result);

  return result;
};

module.exports = main;
