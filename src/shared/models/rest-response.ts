import parseLinkHeader from 'parse-link-header';

export interface PageLink extends parseLinkHeader.Link {
  page: string;
  per_page: string;
}

export interface PageLinks extends parseLinkHeader.Links {
  first: PageLink
  prev: PageLink
  next: PageLink
  last: PageLink
}

export interface RestResponse<T> {
  ok: boolean;
  json?: T;
  unauthorized: boolean;
  pagination?: PageLinks;
}
