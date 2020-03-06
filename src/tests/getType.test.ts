import { gql } from 'apollo-server'
import { Types } from 'mongoose'
import { getType } from '../utils'

const schema = gql`
type Foo {
  id: String
  id: Boolean
  id: Int
  id: Float
  id: ID
  id: String!
  id: [String]
  id: [String!]!
  id: Date
  id: Buffer
}
`
// @ts-ignore
const { fields } = schema.definitions[0]

describe('getType', () => {
  it('String', () => {
    expect(getType(fields[0].type)).toEqual(String)
  })
  it('Boolean', () => {
    expect(getType(fields[1].type)).toEqual(Boolean)
  })
  it('Int', () => {
    expect(getType(fields[2].type)).toEqual(Number)
  })
  it('Float', () => {
    expect(getType(fields[3].type)).toEqual(Types.Decimal128)
  })
  it('ID', () => {
    expect(getType(fields[4].type)).toEqual(Types.ObjectId)
  })

  it('String!', () => {
    expect(getType(fields[5].type)).toEqual(String)
  })

  it('[String]', () => {
    expect(getType(fields[6].type)).toEqual([String])
  })

  it('[String!]!', () => {
    expect(getType(fields[7].type)).toEqual([String])
  })

  it('Date', () => {
    expect(getType(fields[8].type)).toEqual(Date)
  })

  it('Buffer', () => {
    expect(getType(fields[9].type)).toEqual(Buffer)
  })
})
