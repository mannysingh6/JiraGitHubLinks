import { LocalStorageManager } from '@/shared/local-storage-manager';
import { PageLinks, RestResponse } from '@/shared/models/rest-response';
import parseLinkHeader from 'parse-link-header';
import { requestCache } from './request-cache';

interface RestRequest {
  endpoint: string,
  method?: string,
  withAuth?: boolean,
  body?: any,
  useCache?: boolean
  graphql?: boolean
}
export const get = <T>({ endpoint, useCache }: { endpoint: string, useCache?: boolean }) => {
  return _fetch<T>({ endpoint, useCache });
}

export const post = <T>({ endpoint, withAuth = true, body, useCache = false, graphql = false }: { endpoint: string, withAuth?: boolean, body?: any, useCache?: boolean, graphql?: boolean }) => {
  return _fetch<T>({ endpoint, method: 'POST', withAuth, body, useCache, graphql });
}

const _fetch = async <T>({ endpoint, method = 'GET', withAuth = true, useCache = false, body, graphql }: RestRequest): Promise<RestResponse<T>> => {
  const headers: HeadersInit = {
    Accept: 'application/json'
  };
  if (withAuth) {
    const token = await LocalStorageManager.getToken();
    if (token) {
      headers['Authorization'] = `token ${token}`;
    } else {
      return {
        ok: false,
        unauthorized: true
      };
    }
  }

  const bodyStr = body ? JSON.stringify(body) : undefined;
  const request = new Request(endpoint, {
    method: method,
    headers: headers,
    body: bodyStr
  });

  // Get response from cache
  if (!graphql && useCache && method === 'GET') {
    const cachedResponse = requestCache.get(request.url);
    if (cachedResponse) {
      return cachedResponse;
    }
  } else if (graphql && useCache && bodyStr) {
    const cachedResponse = requestCache.get(bodyStr);
    if (cachedResponse) {
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

      // Store response to cache
      if (!graphql && method === 'GET') {
        requestCache.set(request.url, result);
      } else if (graphql && bodyStr) {
        requestCache.set(bodyStr, result);
      }

      return result;
    } else {
      if (response.status === 401) {
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
