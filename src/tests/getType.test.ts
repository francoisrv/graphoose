import { gql } from 'apollo-server'
import { Schema } from 'mongoose'
import getType from '../getType'

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
    expect(getType(fields[3].type)).toEqual(Number)
  })
  it('ID', () => {
    expect(getType(fields[4].type)).toEqual(Schema.Types.ObjectId)
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
})
