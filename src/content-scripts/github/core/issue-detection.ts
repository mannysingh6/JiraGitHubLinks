import { findJiraIssue } from '@/shared/util/jira-util';

export const detectIssue = () => {

  const headerDiv = document.getElementById('partial-discussion-header');
  if (!headerDiv) {
    return false;
  }

  const innerText = headerDiv.innerText;
  const jiraIssue = findJiraIssue(innerText);
  return jiraIssue || false;
}
