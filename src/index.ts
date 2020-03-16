import {
  Document,
  Model,
  Schema,
  SchemaTypeOpts,
  model as mongooseModel,
  models,
  Types,
} from "mongoose"

import {
  Fields,
  MongooseAcceptedType,
  Options,
  Source,
  Directives,
} from "./types"

import {
  getDirectives,
  getSource,
  getType,
  getTypeDefinition,
} from "./utils"

const flags: Array<keyof Directives> = [
  'index',
  'lowercase',
  'sparse',
  'trim',
  'unique',
  'uppercase',
]

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
      if (typeof type === 'string') {
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
          // @ref
          if (directives.ref && directive.name.value === directives.ref && directive.arguments) {
            const arg = directive.arguments.find(arg => arg.name.value === 'model')
            if (arg) {
              // @ts-ignore
              fieldDef.ref = arg.value.value
            }
          }
          // @default
          if (directives.default && directive.name.value === directives.default && directive.arguments) {
            const arg = directive.arguments.find(arg => arg.name.value === 'value')
            if (arg) {
              // @ts-ignore
              fieldDef.default = arg.value.value
            }
          }
          // @alias
          if (directives.alias && directive.name.value === directives.alias && directive.arguments) {
            const arg = directive.arguments.find(arg => arg.name.value === 'name')
            if (arg) {
              // @ts-ignore
              fieldDef.alias = arg.value.value
            }
          }
          // @minlength
          if (directives.minlength && directive.name.value === directives.minlength && directive.arguments) {
            const arg = directive.arguments.find(arg => arg.name.value === 'length')
            if (arg) {
              // @ts-ignore
              fieldDef.minlength = Number(arg.value.value)
            }
          }
          // @maxlength
          if (directives.maxlength && directive.name.value === directives.maxlength && directive.arguments) {
            const arg = directive.arguments.find(arg => arg.name.value === 'length')
            if (arg) {
              // @ts-ignore
              fieldDef.maxlength = Number(arg.value.value)
            }
          }
          // @match
          if (directives.match && directive.name.value === directives.match && directive.arguments) {
            const expression = directive.arguments.find(arg => arg.name.value === 'expression')
            const modifiers = directive.arguments.find(arg => arg.name.value === 'modifiers')
            if (expression) {
              // @ts-ignore
              fieldDef.match = new RegExp(expression.value.value, modifiers ? modifiers.value.value : '')
            }
          }
          // @enum
          if (directives.enum && directive.name.value === directives.enum && directive.arguments) {
            const arg = directive.arguments.find(arg => arg.name.value === 'values')
            if (arg) {
              // @ts-ignore
              fieldDef.enum = arg.value.values.map(v => {
                if (type === Number || type === Types.Decimal128) {
                  return Number(v.value)
                }
                return v.value
              })
            }
          }
          // @min
          if (directives.min && directive.name.value === directives.min && directive.arguments) {
            const arg = directive.arguments.find(arg => arg.name.value === 'value')
            if (arg) {
              // @ts-ignore
              fieldDef.min = Number(arg.value.value)
            }
          }
          // @maxlength
          if (directives.max && directive.name.value === directives.max && directive.arguments) {
            const arg = directive.arguments.find(arg => arg.name.value === 'value')
            if (arg) {
              // @ts-ignore
              fieldDef.max = Number(arg.value.value)
            }
          }
          // flags
          for (const flag of flags) {
            if (directives[flag]  && directive.name.value === directives[flag]) {
              fieldDef[flag] = true
            }
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
  if (models[name]) {
    return models[name]
  }
  const schemaFields = fields(source, options)
  type T = Document & typeof schemaFields
  return mongooseModel<T>(name, new Schema<T>(schemaFields))
}
