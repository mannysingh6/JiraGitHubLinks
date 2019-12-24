import { RestResponse } from '@/shared/models/rest-response';

export interface RequestCacheEntry {
  url: string;
  response: RestResponse<any>;
  lastRead: number;
}

const maxAge = 60 * 60 * 1000; // maximum cache age (ms)

export class RequestCache {

  public cache = new Map<string, RequestCacheEntry>();

  public get(req: Request): RestResponse<any> | undefined {
    const url = req.url;
    const cached = this.cache.get(url);

    if (!cached) {
      return undefined;
    }

    const isExpired = cached.lastRead < (Date.now() - maxAge);
    if (isExpired) {
      this.cache.delete(url);
    }
    return isExpired ? undefined : cached.response;
  }

  public set(req: Request, response: RestResponse<any>) {
    const url = req.url;
    const entry = { url, response, lastRead: Date.now() };
    this.cache.set(url, entry);

    // remove expired cache entries
    const expired = Date.now() - maxAge;
    this.cache.forEach(entry => {
      if (entry.lastRead < expired) {
        this.cache.delete(entry.url);
      }
    });
  }
}

export const requestCache = new RequestCache();
