export interface User {
  id: number;
  login: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  site_admin: boolean;
  name?: string;
  company?: string;
  email?: string;
}
