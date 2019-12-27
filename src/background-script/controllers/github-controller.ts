import { LocalStorageManager } from '@/shared/local-storage-manager';
import { PullRequest } from '@/shared/models/pull-request';
import { RestResponse } from '@/shared/models/rest-response';
import { resetAllTabs } from '@/shared/util/tabs';
import { doGithubLogin } from '../rest/auth';
import { getUser, searchIssues } from '../rest/github';
import { requestCache } from '../rest/request-cache';

class GitHubController {

  public async login() {
    const token = await doGithubLogin();
    if (token) {
      await LocalStorageManager.setToken(token);
      let { json: user, unauthorized, ok } = await getUser();

      if (unauthorized || !ok) {
        this.logout();
        return false;
      }

      if (user) {
        await LocalStorageManager.setUser(user);
        return true;
      }
    }

    return false;
  }

  public async logout() {
    await LocalStorageManager.clearAuthData();
    resetAllTabs();
    requestCache.cache.clear();
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

    if (unauthorized) {
      this.logout();
    }

    return {
      ok,
      json: searchResponse?.data.search.nodes,
      unauthorized
    };
  }
}

export const gitHubController = new GitHubController();
