const nearley = require('nearley')
const grammar = require('./grammar.js')
const generator = require('./generator.js')

module.exports = {
  compile: source => {
    const ast = new nearley.Parser(nearley.Grammar.fromCompiled(grammar)).feed(source)

    return generator(ast.results[0].filter(x => x)) // Filter the comments
  },
  getAST: source => {
    const ast = new nearley.Parser(nearley.Grammar.fromCompiled(grammar)).feed(source)

    return ast.results[0].filter(x => x) // Filter the comments
  }
}
