import { LocalStorageManager } from '@/shared/local-storage-manager';

interface RestRequest {
  endpoint: string,
  method?: string,
  withAuth?: boolean,
  body?: any
}
interface RestResponse {
  ok: boolean;
  json?: any;
  unauthorized: boolean;
}
export const get = ({ endpoint }: { endpoint: string }) => {
  return _fetch({ endpoint });
}

export const post = ({ endpoint, body }: { endpoint: string, body?: any }) => {
  return _fetch({ endpoint, method: 'POST', body })
}

const _fetch = async ({ endpoint, method = 'GET', withAuth = true, body }: RestRequest): Promise<RestResponse> => {
  const headers: any = {
    Accept: 'application/json'
  };
  if (withAuth) {
    const token = await LocalStorageManager.getToken();
    headers['Authorization'] = `token ${token}`;
  }
  const request = new Request(endpoint, {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : undefined
  });

  try {
    const response = await fetch(request);
    if (response.ok) {
      const json = await response.json();
      return {
        ok: response.ok,
        json,
        unauthorized: false
      };
    } else {
      if (response.status === 401) {
        await LocalStorageManager.clearAuthData();
        return {
          ok: response.ok,
          unauthorized: true
        };
      } else {
        console.error(`Network error: ${response.status} ${response.statusText}`);
      }
    }
  } catch (err) {
    console.error('Network error', err);
  }
  return {
    ok: false,
    unauthorized: false
  };
}
