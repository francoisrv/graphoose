graphoose
===

Transform a graphql type into a mongoose schema

```ts
import graphoose from 'graphoose'

const user = gql`
type User {
  _id: ID !
  email: String !
}
`
const User = graphoose(user)

await User.findOne({ email: 'joe@doe.com' })
```

Note: `graphoose` accepts either a string or a graphql object

### Return fields only

```ts
graphoose('type F { email: String }', { returnsField: true }) // { email: { type: String } }
graphoose('type F { email: String ! }', { returnsField: true }) // { email: { type: String, required: true } }
```

### Return schema only

```ts
const schema =graphoose('type F { email: String }', { returnsSchema: true })
mongoose.model('Foo', schema)
```

## References

```graphql
type Player {
  _id: ID !
  team: ID ! @ref(model: "Team")
}
```
