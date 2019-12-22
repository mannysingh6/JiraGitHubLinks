import { User } from './user';

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  owner: User;
  private: boolean;
  description: string;
  fork: boolean;
  url: string;
  html_url: string;
  branches_url: string;
  commits_url: string;
  pulls_url: string;
  issues_url: string;
  archived: boolean;
  disabled: boolean;
  visibility: string;
  pushed_at: string;
  created_at: string;
  updated_at: string;
}
