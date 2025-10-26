import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '../env'

const config = {
  projectId,
  dataset,
  apiVersion,
  useCdn: false
}

export const client = createClient(config)
