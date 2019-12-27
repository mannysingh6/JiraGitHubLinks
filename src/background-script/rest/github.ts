import { PullRequest } from '@/shared/models/pull-request';
import { User } from '@/shared/models/user';
import { get, post } from './rest';

const baseApiUrl = 'https://api.github.com';
const graphqlUrl = 'https://api.github.com/graphql';

export const getUser = () => {
  return get<User>({ endpoint: `${baseApiUrl}/user`, useCache: true });
};

export interface SearchResponse<T> {
  data: {
    search: {
      nodes: T[];
    }
  }
}
export const searchIssues = (q: string) => {
  const query = `query {
    search(query: "${q}", type: ISSUE, first: 10) {
      nodes {
        ... on PullRequest {
          id
          title
          url
          number
        }
      }
    }
  }`;
  const body = { query };
  return post<SearchResponse<PullRequest>>({ endpoint: graphqlUrl, body, useCache: true, graphql: true });
}
