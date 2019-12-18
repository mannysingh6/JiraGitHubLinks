import { post } from './rest';

const clientId = 'eb8d09253d4e7fc70b1e';
const clientSecret = 'e3f7acd7153e5fe666abe53f53679547c4f17c0e';
const loginUrl = 'https://github.com/login/oauth'

export const authorizeUrl = `${loginUrl}/authorize?client_id=${clientId}&scope=repo`;

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
  const response = await post({ endpoint: `${loginUrl}/access_token?${params}` });
  const tokenResponse: AccessTokenResponse = response.json;
  return tokenResponse.access_token;
};
