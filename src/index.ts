import { gql } from 'apollo-server'
import { DocumentNode, ObjectTypeDefinitionNode, isTypeDefinitionNode } from 'graphql'
import mongoose from 'mongoose'
import getType from './getType'

export default (source: string | DocumentNode) => {
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
        fields[field.name.value] = getType(field.type)
      }
    }
  }

  const schema = new mongoose.Schema(fields)
  const model = mongoose.model(name, schema)

  return model
}
