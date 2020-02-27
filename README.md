graphoose
===

Transform a graphql type into a mongoose schema

```ts
import graphoose from 'graphoose'

const user = gql`
type User {
  email: String !
  isVerified: Boolean !
}
`

const User = graphoose(user)

await User.findOne({ email: 'joe@doe.com' })
```

Note: `graphoose` accepts either a string or a graphql object
