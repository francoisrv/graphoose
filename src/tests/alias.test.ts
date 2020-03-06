import { gql } from 'apollo-server'
import * as graphoose from '..'

const Player = gql`
type Player {
  _id: ID !
  score: Int ! @alias(name: "points")
}
`

describe('Alias', () => {
  let player: any
  beforeAll(() => {
    player = graphoose.fields(Player)
  })
  it('should have an alias', () => {
    expect(player.score.alias).toBe('points')
  })
})
