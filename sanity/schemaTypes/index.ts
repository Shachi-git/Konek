import { type SchemaTypeDefinition } from 'sanity'
import { author } from './author'
import { startup } from './startup'
import { savedPost } from './savedPost'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, startup, savedPost],
}
