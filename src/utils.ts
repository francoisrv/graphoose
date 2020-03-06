import { Source, Directives, MongooseAcceptedType, Fields, DirectiveOverwrite } from "./types"
import { DocumentNode, ObjectTypeDefinitionNode, isTypeDefinitionNode, ASTNode } from "graphql"
import { gql } from "apollo-server"
import { Types, Schema } from 'mongoose'
import { fields } from "."

/**
 * Get DocumentNode from a node or a string
 * @param source {Source}
 */
export const getSource = (source: Source): DocumentNode =>
typeof source === 'string' ? gql(source) : source

/**
 * Get type definition from document
 * @param node {DocumentNode}
 */
export const getTypeDefinition = (node: DocumentNode): ObjectTypeDefinitionNode => {
  const [definition] = node.definitions as ObjectTypeDefinitionNode[]

  if (!isTypeDefinitionNode(definition)) {
    throw new Error('Definition must be a type')
  }

  return definition
}

/**
 * Sets a directive value, either set by the user or else to its default value
 * @param directive {String} A directive name
 * @param directives {Directives} A list of directives
 */
const getDirectiveOverwrite = (directive: keyof Directives, directives?: Directives): DirectiveOverwrite => {
  if (directives && (directive in directives)) {
    if (typeof directives[directive] === 'string') {
      return directives[directive] as string
    }
    if (directives[directive] === false) {
      return false
    }
  }
  return directive
}

/**
 * Merge user directives with default directives
 * @param input {Directives} User directives
 */
export const getDirectives = (input: Directives): Directives => {
  const directives: Directives = {}

  const directiveNames: Array<keyof Directives> = [
    'alias',
    'default',
    'index',
    'ref',
    'sparse',
    'unique',
  ]

  for (const directiveName of directiveNames) {
    directives[directiveName] = getDirectiveOverwrite(directiveName, input)
  }

  return directives
}

/**
 * Get GraphQL kind name
 * @param graphqlType {ASTNode}
 */
export const getKind = (graphqlType: ASTNode): string => {
  if (graphqlType.kind === 'NamedType') {
    return graphqlType.name.value
  }
  if (graphqlType.kind === 'NonNullType') {
    return getKind(graphqlType.type)
  }
  if (graphqlType.kind === 'ListType') {
    return `[${ getKind(graphqlType.type) }]`
  }
  return graphqlType.kind
}

/**
 * Get mongoose schema type
 * @param graphqlType {ASTNode}
 */
export const getType = (graphqlType: ASTNode): MongooseAcceptedType | string => {
  const type = getKind(graphqlType)
  switch (type) {
    case 'Boolean': return Boolean
    case 'Date': return Date
    case 'Float': return Types.Decimal128
    case 'ID': return Types.ObjectId
    case 'Int': return Number
    case 'String': return String

    case '[Boolean]': return [Boolean]
    case '[Date]': return [Date]
    case '[Float]': return [Types.Decimal128]
    case '[ID]': return [Types.ObjectId]
    case '[Int]': return [Number]
    case '[String]': return [String]
  }
  return type
}
