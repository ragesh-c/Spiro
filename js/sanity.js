import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'ck2bx4ak',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01'
})
