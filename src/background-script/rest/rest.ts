import { LocalStorageManager } from '@/shared/local-storage-manager';
import { RestResponse } from '@/shared/models/rest-response';

interface RestRequest {
  endpoint: string,
  method?: string,
  withAuth?: boolean,
  body?: any
}
export const get = <T>({ endpoint }: { endpoint: string }) => {
  return _fetch<T>({ endpoint });
}

export const post = <T>({ endpoint, body }: { endpoint: string, body?: any }) => {
  return _fetch<T>({ endpoint, method: 'POST', body })
}

const _fetch = async <T>({ endpoint, method = 'GET', withAuth = true, body }: RestRequest): Promise<RestResponse<T>> => {
  const headers: any = {
    Accept: 'application/json'
  };
  if (withAuth) {
    const token = await LocalStorageManager.getToken();
    if (token) {
      headers['Authorization'] = `token ${token}`;
    } else {
      await LocalStorageManager.clearAuthData();
      return {
        ok: false,
        unauthorized: true
      };
    }
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
          ok: false,
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
