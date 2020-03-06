import { Types } from 'mongoose'

import getRealType from "./getRealType"

const getType = (graphqlType: any) => {
  const type = getRealType(graphqlType)
  switch (type) {
    case 'Int': return Number
    case 'Float': return Types.Decimal128
    case 'Boolean': return Boolean
    case 'String': return String
    case 'ID': return Types.ObjectId
    case 'Date': return Date

    case '[Int]': return [Number]
    case '[Float]': return [Types.Decimal128]
    case '[Boolean]': return [Boolean]
    case '[String]': return [String]
    case '[Date]': return [Date]
    case '[ID]': return [Types.ObjectId]
  }
}

export default getType