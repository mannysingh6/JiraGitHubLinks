import { RestResponse } from '@/shared/models/rest-response';

export interface RequestCacheEntry {
  key: string;
  response: RestResponse<any>;
  lastRead: number;
}

const maxAge = 60 * 60 * 1000; // maximum cache age (ms)

export class RequestCache {

  public cache = new Map<string, RequestCacheEntry>();

  public get(key: string): RestResponse<any> | undefined {
    const cached = this.cache.get(key);

    if (!cached) {
      return undefined;
    }

    const isExpired = cached.lastRead < (Date.now() - maxAge);
    if (isExpired) {
      this.cache.delete(key);
    }
    return isExpired ? undefined : cached.response;
  }

  public set(key: string, response: RestResponse<any>) {
    const entry = { key, response, lastRead: Date.now() };
    this.cache.set(key, entry);

    // remove expired cache entries
    const expired = Date.now() - maxAge;
    this.cache.forEach(entry => {
      if (entry.lastRead < expired) {
        this.cache.delete(entry.key);
      }
    });
  }
}

export const requestCache = new RequestCache();
