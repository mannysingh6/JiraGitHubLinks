import { LocalStorageManager } from '@/shared/local-storage-manager';
import { PageLinks, RestResponse } from '@/shared/models/rest-response';
import parseLinkHeader from 'parse-link-header';
import { requestCache } from './cache';

interface RestRequest {
  endpoint: string,
  method?: string,
  withAuth?: boolean,
  body?: any,
  useCache?: boolean
}
export const get = <T>({ endpoint, useCache }: { endpoint: string, useCache?: boolean }) => {
  return _fetch<T>({ endpoint, useCache });
}

export const post = <T>({ endpoint, withAuth = true, body }: { endpoint: string, withAuth?: boolean, body?: any }) => {
  return _fetch<T>({ endpoint, method: 'POST', withAuth, body });
}


const _fetch = async <T>({ endpoint, method = 'GET', withAuth = true, useCache = false, body }: RestRequest): Promise<RestResponse<T>> => {
  const headers: HeadersInit = {
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

  if (useCache) {
    const cachedResponse = requestCache.get(request);
    if (cachedResponse) {
      console.log('Returning cached response..');
      return cachedResponse;
    }
  }

  try {
    const response = await fetch(request, { cache: 'default' });
    if (response.ok) {
      const json = await response.json();
      const result: RestResponse<T> = {
        ok: response.ok,
        json,
        unauthorized: false
      };
      const linkHeader = response.headers.get('Link');
      if (linkHeader) {
        result.pagination = parseLinkHeader(linkHeader) as PageLinks;
      }
      requestCache.set(request, result);
      return result;
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
