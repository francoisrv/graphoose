import { gql } from 'apollo-server'
import graphoose from '..'

const Player = gql`
type Player {
  _id: ID !
  name: String ! @unique
  age: Int ! @index
  email: String ! @sparse
}
`

describe('Indexes', () => {
  let player: any
  beforeAll(() => {
    player = graphoose(Player, { returnsFields: true })
  })
  it('should have index', () => {
    expect(player.age.index).toBe(true)
  })
  it('should have unique', () => {
    expect(player.name.unique).toBe(true)
  })
  it('should have sparse', () => {
    expect(player.email.sparse).toBe(true)
  })
})
