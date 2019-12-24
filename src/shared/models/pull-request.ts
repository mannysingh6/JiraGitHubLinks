import { Repo } from './repo';
import { User } from './user';

export interface PullRequest {
  id: number;
  title: string;
  url: string;
  html_url: string;
  repository_url?: string;
  number: number;
  state: string;
  locked: boolean;
  user: User;
  body: string;
  created_at: string;
  updated_at: string;
  closed_at: string;
  merged_at: string;
  assignee: User;
  assignees: User[];
  head?: {
    user: User;
    repo: Repo;
  }
}
