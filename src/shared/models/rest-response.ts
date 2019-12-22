export interface RestResponse<T> {
  ok: boolean;
  json?: T;
  unauthorized: boolean;
}
