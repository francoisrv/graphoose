import {
  Document,
  Model,
  Schema,
  SchemaTypeOpts,
  model as mongooseModel,
} from "mongoose"

import {
  Fields,
  MongooseAcceptedType,
  Options,
  Source,
} from "./types"

import {
  getDirectives,
  getSource,
  getType,
  getTypeDefinition,
} from "./utils"

/**
 * Generate mongoose' schema fields from a graphql type
 * @param source {Source}
 * @param options {Options}
 */
export const fields = (source: Source, options: Options = {}): Fields => {
  const definition = getTypeDefinition(getSource(source))
  const directives = getDirectives(options.directives || {})
  const fields: Fields = {}

  if (definition.fields) {
    for (const field of definition.fields) {
      const fieldName = field.name.value
      // We ignore _ids like mongoose does since it is implicit
      if (fieldName === '_id') {
        continue
      }
      // Get field's mongoose type
      let type: MongooseAcceptedType | string | Fields = getType(field.type)
      // Apply nested types
      if (type === 'string') {
        if (options.nested && (fieldName in options.nested)) {
          type = options.nested[fieldName]
        } else {
          throw new Error(
            `Unknow field type: "${ type }" for field: "${ fieldName }"`
          )
        }
      }
      const fieldDef: SchemaTypeOpts<typeof type> = { type }
      //Required
      if (field.type.kind === 'NonNullType') {
        fieldDef.required = true
      }
      // Aply directives
      if (field.directives) {
        for (const directive of field.directives) {
          if (directives.ref && directive.name.value === directives.ref && directive.arguments) {
            const arg = directive.arguments.find(arg => arg.name.value === 'model')
            if (arg) {
              // @ts-ignore
              fieldDef.ref = arg.value.value
            }
          }
          if (directives.default && directive.name.value === directives.default && directive.arguments) {
            const arg = directive.arguments.find(arg => arg.name.value === 'value')
            if (arg) {
              // @ts-ignore
              fieldDef.default = arg.value.value
            }
          }
          if (directives.alias && directive.name.value === directives.alias && directive.arguments) {
            const arg = directive.arguments.find(arg => arg.name.value === 'name')
            if (arg) {
              // @ts-ignore
              fieldDef.alias = arg.value.value
            }
          }
          if (directives.index  && directive.name.value === directives.index) {
            fieldDef.index = true
          }
          if (directives.unique  && directive.name.value === directives.unique) {
            fieldDef.unique = true
          }
          if (directives.sparse  && directive.name.value === directives.sparse) {
            fieldDef.sparse = true
          }
        }
      }
      fields[fieldName] = fieldDef
    }
  }

  return fields
}

/**
 * Returns a mongoose schema from a GraphQl type
 * @param source {Source}
 * @param options {Options}
 */
export const schema = (source: Source, options: Options = {}): Schema<any> => {
  const schemaFields = fields(source, options)
  type T = Document & typeof schemaFields
  return new Schema<T>(schemaFields)
}

/**
 * Returns a mongoose model from a GraphQL type
 * @param source {Source}
 * @param options {Options}
 */
export const model = (source: Source, options: Options = {}): Model<any> => {
  const definition = getTypeDefinition(getSource(source))
  const { value: name } = definition.name
  const schemaFields = fields(source, options)
  type T = Document & typeof schemaFields
  return mongooseModel<T>(name, new Schema<T>(schemaFields))
}
