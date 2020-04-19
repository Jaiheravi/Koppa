module.exports = {
  Empty: _ => null,

  Id: d => d[0],

  Literal: d => ({
    kind: "Literal",
    type: d[0].type,
    value: d[0].value
  }),

  Boolean: d => ({
    kind: "Literal",
    type: d[0].type,
    value: d[0].value === "T" ? "true" : "false"
  }),

  EmptyKeyword: d => ({
    kind: "Literal",
    type: d[0].type,
    value: d[0].value === "Null" ? "null" : "undefined"
  }),

  Declaration: d => d[1].map(x => x[0]),

  Import: d => ({
    kind: "Import",
    identifier: d[0][0],
    content: d[4]
  }),

  RecordPattern: d => ({
    kind: "RecordPattern",
    keys: [
      d[2],
      ...d[3].map(x => x[3])
    ]
  }),

  Definition: d => ({
    kind: "Definition",
    public: !!d[0],
    identifier: d[1].value,
    content: d[5],
    local: d[6] ? d[6][1] : null
  }),

  Where: d => [
    d[2],
    ...d[3].map(x => x[2])
  ],

  InnerDefinition: d => ({
    kind: "InnerDefinition",
    identifier: d[0].value,
    content: d[4],
  }),

  FunctionComposition: d => ({
    kind: "FunctionComposition",
    application: d[0],
    functions: [
      d[4],
      ...d[5].map(x => x[3])
    ]
  }),

  FunctionDefinition: d => ({
    kind: "FunctionDefinition",
    parameters: d[0].map(x => x[0]),
    body: d[3]
  }),

  FunctionApplication: d => ({
    kind: "FunctionApplication",
    function: d[0].value,
    content: d[1].map(x => x[1])
  }),

  Conditional: d => ({
    kind: "Conditional",
    condition: d[2],
    body: d[6],
    alternative: d[7] ? d[7][3] : null
  }),

  GroupExpression: d => ({
    kind: "Group",
    groupContent: d[2]
  }),

  UnaryExpression: d => ({
    kind: "UnaryExpression",
    operator: d[0].value,
    operand: d[1]
  }),

  BinaryExpression: d => ({
    kind: "BinaryExpression",
    left: d[0],
    operator: d[2].value,
    right: d[4]
  }),

  RecordExpression: d => ({
    kind: "RecordExpression",
    body: d[2]
  }),

  RecordBody: d => [
    d[0],
    ...d[1].map(x => x[3])
  ],

  RecordEntry: d => ({
    key: d[1][0],
    value: d[2] ? d[2][3] : d[1][0]
  }),

  ListExpression: d => ({
    kind: "List",
    listData: [
      d[2],
      ...d[4].map(x => x[2])
    ]
  }),

  ListAccessExpression: d => ({
    kind: "ListAccess",
    identifier: d[0].value,
    index: d[3]
  })
}
