import { findJiraIssue } from '@/shared/util/issue-regex';

export const detectIssue = () => {

  const headerDiv = document.getElementById('partial-discussion-header');
  if (!headerDiv) {
    return false;
  }

  const innerText = headerDiv.innerText;
  const jiraIssue = findJiraIssue(innerText);
  return jiraIssue || false;
}
