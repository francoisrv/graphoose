import { gql } from 'apollo-server'
import { getKind } from '../utils'

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

describe('getKind', () => {
  it('String', () => {
    expect(getKind(fields[0].type)).toEqual('String')
  })
  it('Boolean', () => {
    expect(getKind(fields[1].type)).toEqual('Boolean')
  })
  it('Int', () => {
    expect(getKind(fields[2].type)).toEqual('Int')
  })
  it('Float', () => {
    expect(getKind(fields[3].type)).toEqual('Float')
  })
  it('ID', () => {
    expect(getKind(fields[4].type)).toEqual('ID')
  })

  it('String!', () => {
    expect(getKind(fields[5].type)).toEqual('String')
  })

  it('[String]', () => {
    expect(getKind(fields[6].type)).toEqual('[String]')
  })

  it('[String]!', () => {
    expect(getKind(fields[7].type)).toEqual('[String]')
  })

  it('Date', () => {
    expect(getKind(fields[8].type)).toEqual('Date')
  })

  it('Buffer', () => {
    expect(getKind(fields[9].type)).toEqual('Buffer')
  })
})
