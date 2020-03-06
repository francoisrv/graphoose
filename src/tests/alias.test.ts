import { gql } from 'apollo-server'
import graphoose from '..'

const Player = gql`
type Player {
  _id: ID !
  score: Int ! @alias(name: "points")
}
`

describe('Alias', () => {
  let player: any
  beforeAll(() => {
    player = graphoose(Player, { returnsFields: true })
  })
  it('should have an alias', () => {
    expect(player.score.alias).toBe('points')
  })
})
