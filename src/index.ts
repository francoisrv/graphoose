import { gql } from 'apollo-server'
import { DocumentNode, isType } from 'graphql'
import mongoose from 'mongoose'
import getType from './getType'


const models: any = {}

export default async (source: string | DocumentNode) => {
  const def = typeof source === 'string' ? gql(source) : source
  
  if (!isType(def)) {
    throw new Error('Definition must be a type')
  }

  const name = def.definitions[0].name

  if (models[name]) {
    return models[name]
  }
  const fields: any = {}
  // @ts-ignore
  for (const field of def.definitions[0].fields) {
    if (field.name.value !== '_id') {
      fields[field.name.value] = getType(field.type)
    }
  }
  const schema = new mongoose.Schema(fields)
  models[name] = mongoose.model(name, schema)
  return models[name]
}
