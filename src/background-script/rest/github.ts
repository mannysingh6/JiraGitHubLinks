import { PullRequest } from '@/shared/models/pull-request';
import { Repo } from '@/shared/models/repo';
import { User } from '@/shared/models/user';
import { get, post } from './rest';

const baseApiUrl = 'https://api.github.com';
const graphqlUrl = 'https://api.github.com/graphql';

export const getUser = () => {
  return get<User>({ endpoint: `${baseApiUrl}/user`, useCache: true });
};

export const getRepos = (page: number, per_page: number) => {
  return get<Repo[]>({ endpoint: `${baseApiUrl}/user/repos?page=${page}&per_page=${per_page}`, useCache: true });
};

export const getPullRequests = (owner: string, repo: string) => {
  return get<PullRequest[]>({ endpoint: `${baseApiUrl}/repos/${owner}/${repo}/pulls`, useCache: true });
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
