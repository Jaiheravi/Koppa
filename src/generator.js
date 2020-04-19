module.exports = ast => {
  console.log(JSON.stringify(ast, null, 2)) // DEBUG AST

  return ' '

  // const declarations = ast.map(parseNode).reduce(
  //   (program, declaration, i) => program + (i === 0 ? '' : '\r\n') + declaration, '')

  // const exportList =
  //   ast.filter(declaration => declaration.public)
  //   .reduce((list, decl, i, xs) =>
  //     list + `${decl.identifier}` + (i === xs.length - 1 ? '' : ', '), '')

  // return `"use strict";\r\n${declarations}\r\nmodule.exports = {${exportList}};\r\n`
}

const parseNode = node => {
  switch (node.kind) {
    case "Literal":
      return node.value

    case "Import":
      return `const ${parseNode(node.identifier)} = require(${parseNode(node.content)});`

    case "Definition":
      return `const ${node.identifier} = ${parseNode(node.content)};`

    case "UnaryExpression":
      return `${node.operator}${getExpression(node.operand)}`

    case "BinaryExpression":
      return `${getExpression(node.left)} ${node.operator} ${getExpression(node.right)}`

    case "Conditional": {
      if (node.alternative === null) {
        // Use short-circuit evaluation for simple conditionals
        return `${getExpression(node.condition)} && ${getExpression(node.body)}`
      } else {
        return `${getExpression(node.condition)}
          ? ${getExpression(node.body)}
          : ${getExpression(node.alternative)}`
      }
    }

    case "FunctionDefinition":
      return node.parameters.map(getExpression).reduce((params, param) =>
        params + `${param} => `, '') + getExpression(node.body)

    case "FunctionApplication":
      return getExpression(node.function) +
        node.content.map(getExpression).reduce((args, arg) => args + `(${arg})`, '')

    case "FunctionComposition": {
      const chain = node.chain.map(getExpression).reverse().reduce(
        (xs, x, i) => xs + (i === 0 ? `(${x})` : `((${x})`),
        ''
      )

      return chain + `(${getExpression(node.first)})` + ')'.repeat(node.chain.length - 1)
    }

    case "Record": {
      const recordContent = node.recordData.map(entry => ({
        identifier: entry.identifier,
        expression: getExpression(entry.expression)
      })).reduce((record, entry, i) =>
        record + `${entry.identifier}: ${entry.expression}` + (i === data.length - 1 ? '' : ', ') , '')

      return `{${recordContent}}`
    }

    case "List":
      return `[${node.listData.map(getExpression).reduce((list, item, i) => list + (i === 0 ? '' : ', ') + item, '')}]`

    case "Group":
      return `(${getExpression(node.groupContent)})`

    default:
      return ''
  }
}

