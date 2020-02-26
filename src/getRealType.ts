const getRealType = (graphqlType: any): string => {
  if (graphqlType.kind === 'NamedType') {
    return graphqlType.name.value
  }
  if (graphqlType.kind === 'NonNullType') {
    return getRealType(graphqlType.type)
  }
  if (graphqlType.kind === 'ListType') {
    return `[${ getRealType(graphqlType.type) }]`
  }
  return graphqlType.kind
}

export default getRealType
