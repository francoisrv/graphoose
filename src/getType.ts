import { Schema } from 'mongoose'

import getRealType from "./getRealType"

const getType = (graphqlType: any) => {
  const type = getRealType(graphqlType)
  switch (type) {
    case 'Int': return Number
    case 'Float': return Number
    case 'Boolean': return Boolean
    case 'String': return String
    case 'ID': return Schema.Types.ObjectId
    case 'Date': return Date

    case '[Int]': return [Number]
    case '[Float]': return [Number]
    case '[Boolean]': return [Boolean]
    case '[String]': return [String]
    case '[Date]': return [Date]
    case '[ID]': return [Schema.Types.ObjectId]
  }
}

export default getType