import { gql } from 'apollo-server'
import graphoose from '.'

const Player = gql`
type Player {
  team: ID ! @ref(model: "Team")
}
`

describe('References', () => {
  it('should have references', () => {
    const f = graphoose(Player, { returnsFields: true })
    expect(f.team.ref).toEqual('Team')
  })
})
