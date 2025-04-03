import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pexelsApi = createApi({
  reducerPath: 'pexelsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.pexels.com/v1/',
    prepareHeaders: (headers) => {
      const apiKey = process.env.REACT_APP_PEXELS_API_KEY;
      if (apiKey) {
        headers.set('Authorization', apiKey);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getImagesByTerm: builder.query<any, string>({
      query: (term) => ({
        url: 'search',
        params: {
          query: term,
          per_page: 96
        }
      }),
    }),
  }),
});

export const { useGetImagesByTermQuery } = pexelsApi;