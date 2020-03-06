import { gql } from 'apollo-server'
import * as graphoose from '..'

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
    const f = graphoose.fields(Player)
    expect(f.team.ref).toEqual('Team')
  })
  it('should have references under another name', () => {
    const f = graphoose.fields(PlayerLink, { directives: { ref: 'link' } })
    expect(f.team.ref).toEqual('Team')
  })
  it('should not have reference', () => {
    const f = graphoose.fields(Player, { directives: { ref: false } })
    expect(f.team).not.toHaveProperty('ref')
  })
})
