import { gql } from 'apollo-server'
import { Types }from 'mongoose'
import graphoose from '..'

const ScalarTypes = gql`
type ScalarTypes {
  string: String
  integer: Int
  float: Float
  boolean: Boolean
  id: ID
  required: String !
}
`

describe('Return fields', () => {
  describe('Scalar Types', () => {
    let fields: any
    beforeAll(() => {
      fields = graphoose(ScalarTypes, { returnsFields: true })
    })
    it('should parse strings', () => {
      expect(fields.string).toEqual({ type: String })
    })
    it('should parse integers', () => {
      expect(fields.integer).toEqual({ type: Number })
    })
    it('should parse floats', () => {
      expect(fields.float).toEqual({ type: Types.Decimal128 })
    })
    it('should parse booleans', () => {
      expect(fields.boolean).toEqual({ type: Boolean })
    })
    it('should parse required', () => {
      expect(fields.required).toEqual({ type: String, required: true })
    })
  })
})