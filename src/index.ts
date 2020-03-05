import { gql } from 'apollo-server'
import { DocumentNode, ObjectTypeDefinitionNode, isTypeDefinitionNode } from 'graphql'
import mongoose, { Document, Model, Schema, SchemaTypeOpts } from 'mongoose'
import getType from './getType'

interface Options {
  returnsFields?: true
  returnsSchema?: true
}

type Source = string | DocumentNode

function graphoose(source: Source): Model<any>
function graphoose(source: Source, options: { returnsFields: true }): { [name: string]: SchemaTypeOpts<any> }
function graphoose(source: Source, options: { returnsSchema: true }): Schema

function graphoose(source: string | DocumentNode, options: Options = {}): Model<any> | Schema | object {
  const document = typeof source === 'string' ? gql(source) : source

  const [definition] = document.definitions as ObjectTypeDefinitionNode[]

  if (!isTypeDefinitionNode(definition)) {
    throw new Error('Definition must be a type')
  }

  const { value: name } = definition.name

  const fields: any = {}

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
            if (directive.name.value === 'ref') {
              if (directive.arguments) {
                const arg = directive.arguments.find(arg => arg.name.value === 'model')
                if (arg) {
                  // @ts-ignore
                  fieldDef.ref = arg.value.value
                }
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
