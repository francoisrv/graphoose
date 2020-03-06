import { gql } from 'apollo-server'
import getRealType from '../getRealType'

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

describe('getRealType', () => {
  it('String', () => {
    expect(getRealType(fields[0].type)).toEqual('String')
  })
  it('Boolean', () => {
    expect(getRealType(fields[1].type)).toEqual('Boolean')
  })
  it('Int', () => {
    expect(getRealType(fields[2].type)).toEqual('Int')
  })
  it('Float', () => {
    expect(getRealType(fields[3].type)).toEqual('Float')
  })
  it('ID', () => {
    expect(getRealType(fields[4].type)).toEqual('ID')
  })

  it('String!', () => {
    expect(getRealType(fields[5].type)).toEqual('String')
  })

  it('[String]', () => {
    expect(getRealType(fields[6].type)).toEqual('[String]')
  })

  it('[String]!', () => {
    expect(getRealType(fields[7].type)).toEqual('[String]')
  })

  it('Date', () => {
    expect(getRealType(fields[8].type)).toEqual('Date')
  })
})
