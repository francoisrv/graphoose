graphoose
===

Transform a graphql type into a mongoose model

```ts
import graphoose from 'graphoose'

const user = gql`
type User {
  _id: ID !
  email: String !
  dob: Date !
}
`
const User = graphoose(user)

await User.findOne({ email: 'joe@doe.com' })
```

Note: `graphoose` accepts either a string or a graphql object

### Return fields only

```ts
graphoose('type F { email: String }', { returnsField: true })
// { email: { type: String } }
```

### Return schema only

```ts
const schema = graphoose('type F { a: Int }', { returnsSchema: true })
mongoose.model('Foo', schema)
```

## Scalars

| Graphql | Mongoose |
|---------|---------|
| Boolean | Boolean |
| Date | Date |
| Float | Decimal128 |
| ID | ObjectId |
| Int | Number |
| String | String |

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
graphoose(Player, { directives: { ref: 'link' } })
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
