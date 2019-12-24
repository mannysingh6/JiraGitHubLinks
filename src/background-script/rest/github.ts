import { PullRequest } from '@/shared/models/pull-request';
import { Repo } from '@/shared/models/repo';
import { get } from './rest';

const baseApiUrl = 'https://api.github.com';

export const getRepos = (page: number, per_page: number) => {
  return get<Repo[]>({ endpoint: `${baseApiUrl}/user/repos?page=${page}&per_page=${per_page}`, useCache: true });
};

export const getPullRequests = (owner: string, repo: string) => {
  return get<PullRequest[]>({ endpoint: `${baseApiUrl}/repos/${owner}/${repo}/pulls`, useCache: true });
};

export interface SearchResponse<T> {
  total_count: number,
  incomplete_results: boolean,
  items: T[]
}
export const searchIssues = (q: string) => {
  return get<SearchResponse<PullRequest>>({ endpoint: `${baseApiUrl}/search/issues?q=${q}`, useCache: true });
}
