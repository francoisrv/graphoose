graphoose
===

Transform a graphql type into a mongoose model

```ts
import * as graphoose from 'graphoose'

const user = gql`
type User {
  _id: ID !
  email: String !
  dob: Date !
}
`
const User = graphoose.model(user)

await User.findOne({ email: 'joe@doe.com' })
```

Note: `graphoose` accepts either a string or a graphql object

### Return fields only

```ts
graphoose.fields('type F { a: Int }') // { a: { type: Number } }
```

### Return schema only

```ts
const F = graphoose.schema('type F { a: Int }')
mongoose.model('Foo', schema)
```

## Scalars

| Graphql | Mongoose |
|---------|---------|
| Boolean | Boolean |
| Buffer | Buffer |
| Date | Date |
| Float | Decimal128 |
| ID | ObjectId |
| Int | Number |
| String | String |
| [String] | [String] |

## Unsupported mongoose types

- [Maps](https://github.com/graphql/graphql-spec/issues/101)

## Unsupported GraphQL types

There is no (yet) support for the following types:

- Union
- Enum

You can emulate enum via the enum directive (see below)

## Nested schema

```ts
const TEAM = gql`
type Team {
  name: String !
}
`
const PLAYER = gql`
type Player {
  _id: ID !
  name: String !
  team: Team !
}
`
const team = graphoose.fields(TEAM)
graphoose.model(PLAYER, { nested: { team } })
```

## Directives

You can use the following directives. You can find their declarations [here](./directives.graphql)

You can rename a directive by passing its new name, let's say you rename the directive `ref` to `link`:

```ts
const Player = gql`
type Player {
  _id: ID !
  team: ID ! @link(model: "Team")
}
`
graphoose.model(Player, { directives: { ref: 'link' } })
```

You can also invalidate a directive like this `{ directives: { ref: false } }`

### References

```graphql
type Player {
  _id: ID !
  team: ID ! @ref(model: "Team")
}
```

### Indexes

```graphql
type Player {
  _id: ID !
  name: String ! @unique
  age: Int ! @index
  email: String ! @sparse
}
```

### Default value

```graphql
type Player {
  _id: ID !
  score: Int ! @default(value: 100)
}
```

### Alias

```graphql
type Player {
  _id: ID !
  score: Int ! @alias(name: "points")
}
```

### String

```graphql
type Player {
  _id:        ID !
  username:   String !  @lowercase @minlength(length: 2) @trim
  lastname:   String    @uppercase @trim @maxlength(length: 100)
  email:      String !  @match(expression: "^.+@.+\..+$" modifiers: "i")
  power:      String    @enum(values: ["up" "down"])
}
```

### Number an dates

```graphql
type Player {
  _id:        ID !
  score:      Int !     @min(value: 2) @max(value: 16)
  epoch:      Int !     @enum(values: [2 4 16]) 
  date:       Date !    @min(date: '2010-01-01' max: '2020-01-01')
}
```
