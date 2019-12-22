import { PullRequest } from '@/shared/models/pull-request';
import { Repo } from '@/shared/models/repo';
import { get } from "./rest";

const baseApiUrl = "https://api.github.com";

export const getRepos = () => {
  return get<Repo[]>({ endpoint: `${baseApiUrl}/user/repos` });
};

export const getPullRequests = (owner: string, repo: string) => {
  return get<PullRequest[]>({ endpoint: `${baseApiUrl}/user/repos/${owner}/${repo}/pulls` });
};
