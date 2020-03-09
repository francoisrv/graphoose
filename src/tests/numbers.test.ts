import { gql } from 'apollo-server'
import * as graphoose from '..'

const Player = gql`
type Player {
  _id:        ID !
  score:      Int !     @min(value: 2) @max(value: 16)
  epoch:      Int !     @enum(values: [2 4 16]) 
}
`

describe('Numbers', () => {
  let player: any
  beforeAll(() => {
    player = graphoose.fields(Player)
  })
  it('should have a min value', () => {
    expect(player.score.min).toEqual(2)
  })
  it('should have an uppercase', () => {
    expect(player.score.max).toEqual(16)
  })
  it('should have enum numbers', () => {
    expect(player.epoch.enum).toEqual([2, 4, 16])
  })
})
