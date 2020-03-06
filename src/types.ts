import { DocumentNode } from "graphql"
import { SchemaTypeOpts, Types } from "mongoose"

/**
 * Nested schemas declartion
 */
export interface NestedSchemas {
  nested?: { [name: string]: Fields }
}

/**
 * A directive format (either its name or false to ignore it)
 */
export type DirectiveOverwrite = string | false

/**
 * List of directives
 */
export interface Directives {
  alias?: DirectiveOverwrite
  default?: DirectiveOverwrite
  index?: DirectiveOverwrite
  ref?: DirectiveOverwrite
  sparse?: DirectiveOverwrite
  unique?: DirectiveOverwrite
}

/**
 * List of directives as passed inside options
 */
export interface DirectiveList {
  directives?: Directives
}

/**
 * The Graphql format accepted by graphoose
 */
export type Source = string | DocumentNode

/**
 * Options without returning options
 */
export type Options = DirectiveList & NestedSchemas

/**
 * mongoose schema fields
 */
export type Fields = { [name: string]: SchemaTypeOpts<any> }

/**
 * Accepted mongoose schema types
 */
export type MongooseAcceptedType =
| typeof String
| typeof Number
| typeof Date
| typeof Boolean
| typeof Types.ObjectId
| typeof Types.Decimal128
| MongooseAcceptedType[]