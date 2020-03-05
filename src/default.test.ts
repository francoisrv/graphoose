import { gql } from 'apollo-server'
import graphoose from '.'

const Player = gql`
type Player {
  _id: ID !
  name: String ! @default(value: "joe")
}
`

describe('Default values', () => {
  let player: any
  beforeAll(() => {
    player = graphoose(Player, { returnsFields: true })
  })
  it('should have a default value', () => {
    expect(player.name.default).toBe('joe')
  })
})
