import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: '6y0aobbo',
  dataset: 'production',
  useCdn: false,
  headers: {
    'X-Custom-Header': 'custom-value'
  },
  apiVersion: '2025-10-30',
})