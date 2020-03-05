import { gql } from 'apollo-server'
import { DocumentNode, ObjectTypeDefinitionNode, isTypeDefinitionNode } from 'graphql'
import mongoose, { Document, Model, Schema, SchemaTypeOpts } from 'mongoose'
import getType from './getType'

interface Options {
  returnsFields?: true
  returnsSchema?: true
}

type DirectiveOverwrite = string | false

interface Directives {
  ref?: DirectiveOverwrite
}

interface DirectiveList {
  directives?: Directives
}

type Source = string | DocumentNode

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

function graphoose(source: Source): Model<any>
function graphoose(source: Source, options: { returnsFields: true } & DirectiveList): { [name: string]: SchemaTypeOpts<any> }
function graphoose(source: Source, options: { returnsSchema: true } & DirectiveList): Schema

function graphoose(source: string | DocumentNode, options: Options & DirectiveList = {}): Model<any> | Schema | object {
  const document = typeof source === 'string' ? gql(source) : source

  const [definition] = document.definitions as ObjectTypeDefinitionNode[]

  if (!isTypeDefinitionNode(definition)) {
    throw new Error('Definition must be a type')
  }

  const { value: name } = definition.name

  const fields: any = {}

  const directives = {
    ref: getDirectiveOverwrite('ref', options.directives)
  }

  if (definition.fields) {
    for (const field of definition.fields) {
      if (field.name.value !== '_id') {
        const fieldDef: SchemaTypeOpts<any> = {
          type: getType(field.type)
        }
        if (field.type.kind === 'NonNullType') {
          fieldDef.required = true
        }
        if (field.directives) {
          for (const directive of field.directives) {
            if (directives.ref && directive.name.value === directives.ref && directive.arguments) {
              const arg = directive.arguments.find(arg => arg.name.value === 'model')
              if (arg) {
                // @ts-ignore
                fieldDef.ref = arg.value.value
              }
            }
          }
        }
        fields[field.name.value] = fieldDef
      }
    }
  }

  if (options.returnsFields) {
    return fields
  }

  console.log({fields})

  type T =
  & Document
  & typeof fields

  const schema = new Schema<T>(fields)

  if (options.returnsSchema) {
    return schema
  }

  const model = mongoose.model<T>(name, schema)

  return model
}

export default graphoose
