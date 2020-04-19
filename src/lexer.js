const moo = require('moo')

module.exports = moo.compile({
  ws: { match: /[\s]/, lineBreaks: true },
  shebang:  /^#!.*/,
  comment: /\-\-.*?$/,
  boolean: ["T", "F"],
  emptyKeyword: ["Null", "Undefined"],
  number: {
    match:/-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
    value: v => parseFloat(v)
  },
  string: /'(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^'\\])*'/,
  regex: /\/.*?\//,
  binaryOperator: ["==", "*", "-", "+", "/", "^", "<", ">", "<=", ">=", "||", "&&", "!="],
  symbol: ["(", ")", "[", "]", "{", "}", "=", ",", ":", "=>", "|>"],
  unaryOperator: ["-", "!"],
  keyword: ["from", "if", "then", "else", "public", "where"],
  identifier: /(?![0-9])[a-zA-Z0-9\->_\.\?!]+/,
})
