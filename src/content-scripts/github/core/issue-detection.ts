import { LocalStorageManager } from '@/shared/local-storage-manager';
import { findJiraIssue } from '@/shared/util/jira-util';

export const detectIssue = async () => {

  const headerDiv = document.getElementById('partial-discussion-header');
  if (!headerDiv) {
    return false;
  }

  const innerText = headerDiv.innerText;
  const projectKeys = await LocalStorageManager.getProjectKeys();
  const jiraIssue = findJiraIssue(innerText, projectKeys);
  return jiraIssue || false;
}
