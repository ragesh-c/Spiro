import { createClient } from 'https://cdn.jsdelivr.net/npm/@sanity/client@6.15.20/+esm'

export const client = createClient({
  projectId: 'hdsri1qi',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01'
})
