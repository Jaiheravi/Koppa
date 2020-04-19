@{%
  const AST = require("./ast.js")
  const lexer = require("./lexer.js")
%}

@lexer lexer

###############################################################################
# Grammatical Definition

Program
  -> _ (Declaration _):* {% AST.Declaration %}

Declaration
  -> Comment {% AST.Id %}
  |  Import {% AST.Id %}
  |  Definition {% AST.Id %}
  |  %shebang {% AST.Literal %}

Import
  -> (Identifier | RecordPattern) __ "from" __ String {% AST.Import %}

RecordPattern
  -> "{" _ Identifier (_ "," _ Identifier):* _ "}" {% AST.RecordPattern%}

Definition
  -> ("public" __):? Identifier __ "=" __ Expression (__ Where):? {% AST.Definition %}

Where
  -> "where" __ InnerDefinition ("," __ InnerDefinition):* {% AST.Where %}

InnerDefinition
  -> Identifier __ "=" __ Expression {% AST.InnerDefinition %}

Expression
  -> FunctionComposition {% AST.Id %}
  |  FunctionDefinition {% AST.Id %}
  |  FunctionApplication {% AST.Id %}
  |  Conditional {% AST.Id %}
  |  PrimitiveExpression {% AST.Id %}

FunctionComposition
  -> FunctionApplication __ "|>" __ ApplicableExpression (__ "|>" __ ApplicableExpression):* {% AST.FunctionComposition %}

FunctionDefinition
  -> (Identifier __):+ "=>" __ DefinableExpression {% AST.FunctionDefinition %}

FunctionApplication
  -> Identifier (__ PrimitiveExpression):+ {% AST.FunctionApplication %}

Conditional
  -> "if" __ LogicExpression __ "then" __ DefinableExpression (__ "else" __ DefinableExpression):? {% AST.Conditional %}

PrimitiveExpression
  -> GroupExpression {% AST.Id %}
  |  UnaryExpression {% AST.Id %}
  |  BinaryExpression {% AST.Id %}
  |  RecordExpression {% AST.Id %}
  |  ListExpression {% AST.Id %}
  |  ListAccessExpression {% AST.Id %}
  |  Identifier {% AST.Id %}
  |  Number {% AST.Id %}
  |  String {% AST.Id %}
  |  Boolean {% AST.Id %}
  |  Regex {% AST.Id %}
  |  EmptyKeyword {% AST.Id %}

ApplicableExpression
  -> Identifier {% AST.Id %}
  |  FunctionDefinition {% AST.Id %}
  |  FunctionApplication {% AST.Id %}

DefinableExpression
  -> Conditional {% AST.Id %}
  |  FunctionComposition {% AST.Id %}
  |  FunctionApplication {% AST.Id %}
  |  PrimitiveExpression {% AST.Id %}

LogicExpression
  -> UnaryExpression {% AST.Id %}
  |  BinaryExpression {% AST.Id %}
  |  Identifier {% AST.Id %}
  |  Boolean {% AST.Id %}

GroupExpression
  -> "(" _ Expression _ ")" {% AST.GroupExpression %}

UnaryExpression
  -> %unaryOperator PrimitiveExpression {% AST.UnaryExpression %}

BinaryExpression
  -> PrimitiveExpression __ %binaryOperator __ PrimitiveExpression {% AST.BinaryExpression %}

RecordExpression
  -> "{" _ RecordBody _ "}" {% AST.RecordExpression %}

RecordBody
  -> RecordEntry (_ "," _ RecordEntry):* {% AST.RecordBody %}

RecordEntry
  -> (Comment _):? (Identifier | String) (_ ":" _ Expression):? (_ Comment):? {% AST.RecordEntry %}

ListExpression
  -> "[" _ PrimitiveExpression _ ("," _ PrimitiveExpression _):* "]" {% AST.ListExpression %}

ListAccessExpression
  -> Identifier "[" _ DefinableExpression _ "]" {% AST.ListAccessExpression %}

Identifier
  -> %identifier {% AST.Literal %}

Number
  -> %number {% AST.Literal %}

String
  -> %string {% AST.Literal %}

Boolean
  -> %boolean {% AST.Boolean %}

Regex
  -> %regex {% AST.Literal %}

EmptyKeyword
  -> %emptyKeyword {% AST.EmptyKeyword %}

_ -> %ws:* {% AST.Empty %}
__ -> %ws:+ {% AST.Empty %}

Comment -> %comment {% AST.Empty %}
