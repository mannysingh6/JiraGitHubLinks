import { LocalStorageManager } from '@/shared/local-storage-manager';
import { post } from './rest';

const clientId = 'eb8d09253d4e7fc70b1e';
const clientSecret = 'e3f7acd7153e5fe666abe53f53679547c4f17c0e';
const loginUrl = 'https://github.com/login/oauth'

const authorizeUrl = `${loginUrl}/authorize?client_id=${clientId}&scope=repo`;

interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}
export const getAccessToken = async (code: string) => {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code: code
  });
  const response = await post<AccessTokenResponse>({ endpoint: `${loginUrl}/access_token?${params}`, withAuth: false });
  const tokenResponse = response.json;
  return tokenResponse?.access_token;
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
      if (token) {
        await LocalStorageManager.setToken(token);
        return true;
      }
    } else {
      new Error("No oauth code found");
    }
  } catch (err) {
    console.error("Failed to login", err);
  }
  return false;
};
