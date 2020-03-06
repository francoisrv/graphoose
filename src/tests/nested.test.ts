import { gql } from 'apollo-server'
import * as graphoose from '..'

const team = gql`
type Team {
  _id: ID !
  name: String !
}
`
const player = gql`
type Player {
  _id: ID !
  name: String !
  team: Team !
}
`

describe('Nested', () => {
  let schema: any
  beforeAll(() => {
    schema = graphoose.fields(player, {
      nested: {
        team: graphoose.fields(team)
      }
    })
  })
  it('should have a nested team', () => {
    expect(schema.team).toEqual({
      type: {
        name: {
          type: String,
          required: true
        }
      },
      required: true
    })
  })
})
