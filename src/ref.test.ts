import { gql } from 'apollo-server'
import graphoose from '.'

const Player = gql`
type Player {
  team: ID ! @ref(model: "Team")
}
`

const PlayerLink = gql`
type Player {
  team: ID ! @link(model: "Team")
}
`

describe('References', () => {
  it('should have references', () => {
    const f = graphoose(Player, { returnsFields: true })
    expect(f.team.ref).toEqual('Team')
  })
  it('should have references under another name', () => {
    const f = graphoose(PlayerLink, { returnsFields: true, directives: { ref: 'link' } })
    expect(f.team.ref).toEqual('Team')
  })
})
