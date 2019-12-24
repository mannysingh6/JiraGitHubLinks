import { PullRequest } from '@/shared/models/pull-request';
import { Repo } from '@/shared/models/repo';
import { RestResponse } from '@/shared/models/rest-response';
import { getRepos, searchIssues } from '../rest/github';

class GitHubController {

  public async searchForPullRequest(issue: string): Promise<RestResponse<PullRequest[]>> {
    let { json: searchResponse, unauthorized, ok } = await searchIssues(`${encodeURIComponent(issue)}+type:pr`);
    return {
      ok,
      json: searchResponse?.items,
      unauthorized
    };
  }

  public async getAllUserRepos(): Promise<RestResponse<Repo[]>> {
    let currentPage = 1;
    const perPage = 100;
    let { json: repos, unauthorized, pagination, ok } = await getRepos(currentPage, perPage);
    if (repos && pagination?.last.page) {
      const lastPage = +pagination?.last.page;
      if (pagination && lastPage) {
        const allResponses = await Promise.all([...Array(lastPage - 1)].map((_, i) => {
          currentPage = currentPage + 1;
          return getRepos(currentPage, perPage);
        }));
        const allRepos = allResponses.map(response => {
          return response.json;
        }).reduce((pv, cv) => {
          return (cv && pv) && [...pv, ...cv]
        }, []);
        if (allRepos) {
          repos = [...repos, ...allRepos];
        }
      }
    }
    return {
      ok,
      json: repos,
      unauthorized
    };
  }
}

export const gitHubController = new GitHubController();
