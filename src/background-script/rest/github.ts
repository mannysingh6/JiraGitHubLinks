import { LocalStorageManager } from "@/shared/local-storage-manager";
import { authorizeUrl, getAccessToken } from "./auth";
import { get } from "./rest";

const baseApiUrl = "https://api.github.com";

export const getRepos = async () => {
  const response = await get({ endpoint: `${baseApiUrl}/user/repos` });
  return {
    repos: response.json,
    unauthorized: response.unauthorized
  };
};

export const getPullRequests = async (owner: string, repo: string) => {
  return get({ endpoint: `${baseApiUrl}/user/repos/${owner}/${repo}/pulls` });
};

export const doGithubLogin = async () => {
  try {
    const redirectUrl = await xbrowser.identity.launchWebAuthFlow({
      url: authorizeUrl,
      interactive: true
    });
    const urlParams = new URLSearchParams(new URL(redirectUrl).search);
    const code = urlParams.get("code");
    if (code) {
      const token = await getAccessToken(code);
      await LocalStorageManager.setToken(token);
    } else {
      new Error("No oauth code found");
    }
  } catch (err) {
    console.error("Failed to login", err);
  }
};
