import { PullRequest } from '@/shared/models/pull-request';
import { Repo } from '@/shared/models/repo';
import { get } from "./rest";

const baseApiUrl = "https://api.github.com";

export const getRepos = () => {
  return get<Repo[]>({ endpoint: `${baseApiUrl}/user/repos` });
};

export const getPullRequests = (ownerId: number, repoId: number) => {
  return get<PullRequest[]>({ endpoint: `${baseApiUrl}/user/repos/${ownerId}/${repoId}/pulls` });
};
