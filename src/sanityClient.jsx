// ~/sanityClient.ts
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: '6y0aobbo',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, // Set to false for build-time fetching
});
