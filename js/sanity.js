import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'hdsri1qi',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01'
})
