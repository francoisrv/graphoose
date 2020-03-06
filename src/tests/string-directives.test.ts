import { gql } from 'apollo-server'
import * as graphoose from '..'

const Player = gql`
type Player {
  _id:        ID !
  username:   String !  @lowercase @minlength(length: 2) @trim
  lastname:   String    @uppercase @trim @maxlength(length: 100)
  email:      String !  @match(expression: "^.+@.+\..+$" modifiers: "i")
  power:      String    @enum(values: ["up" "down"])
  maps:       Int !     @enum(values: [4 6 18])
}
`

describe('Strings', () => {
  let player: any
  beforeAll(() => {
    player = graphoose.fields(Player)
  })
  it('should have a lowercase', () => {
    expect(player.username.lowercase).toBe(true)
  })
  it('should have an uppercase', () => {
    expect(player.lastname.uppercase).toBe(true)
  })
  it('should have a trim', () => {
    expect(player.lastname.trim).toBe(true)
  })
  it('should have min length', () => {
    expect(player.username.minlength).toBe(2)
  })
  it('should have max length', () => {
    expect(player.lastname.maxlength).toBe(100)
  })
  it('should have a match', () => {
    expect(player.email.match.toString()).toEqual('/^.+@.+\..+$/i')
  })
  it('should have enum strings', () => {
    expect(player.power.enum).toEqual(['up', 'down'])
  })
  it('should have enum numbers', () => {
    expect(player.maps.enum).toEqual([4, 6, 18])
  })
})
