import { LocalStorageManager } from '@/shared/local-storage-manager';
import { PullRequest } from '@/shared/models/pull-request';
import { RestResponse } from '@/shared/models/rest-response';
import { doGithubLogin } from '../rest/auth';
import { getUser, searchIssues } from '../rest/github';

class GitHubController {

  public async login() {
    const token = await doGithubLogin();
    if (token) {
      await LocalStorageManager.setToken(token);
      const user = await getUser();
      if (user.json) {
        await LocalStorageManager.setUser(user.json);
        return true;
      }
    }

    return false;
  }

  public async searchForPullRequest(issue: string): Promise<RestResponse<PullRequest[]>> {
    const user = await LocalStorageManager.getUser();
    if (!user) {
      return {
        ok: false,
        unauthorized: true
      }
    }
    const company = user.company?.replace('@', '');
    const q = `${issue} in:title type:pr org:${company} user:${user.login}`;
    let { json: searchResponse, unauthorized, ok } = await searchIssues(q);
    return {
      ok,
      json: searchResponse?.data.search.nodes,
      unauthorized
    };
  }
}

export const gitHubController = new GitHubController();
