import { getPullRequests, getRepos } from '../rest/github';

class PullRequestsController {
  public async getPullRequestsForIssue(issue: string) {
    const { json: repos, unauthorized } = await getRepos();
    return repos?.map(async repo => {
      return getPullRequests(repo.owner.id, repo.id);
    }) || [];
  }
}

export const pullRequestsController = new PullRequestsController();
