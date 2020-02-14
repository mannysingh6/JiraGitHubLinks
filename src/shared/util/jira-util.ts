import { LocalStorageManager } from '../local-storage-manager';

export const findJiraIssue = (str: string, projectKeys: string) => {
  projectKeys = projectKeys.replace(/,/g, '|');
  const re = new RegExp(`(^|\\s)((${projectKeys})(\\-|\\W)[0-9|.|:]+)+($|\\s)`, 'ig');
  const matches = str.match(re);
  if (matches && matches.length > 0) {
    return matches[0].trim().replace(/[.|:]/g, '');
  }
}

export const buildJiraIssueFromDefault = (str: string, defaultKey: string) => {
  const re = new RegExp('^[0-9|.|:]+$');
  if (!re.test(str)) {
    // return if not a number
    return null;
  }

  const issueNum = str.replace(/[.|:]/g, '');
  return `${defaultKey}-${issueNum}`;
}

export const buildJiraLink = async (issue: string) => {
  const formattedIssue = issue.replace(' ', '-');
  const jiraUrl = await LocalStorageManager.getJiraUrl();
  return `${jiraUrl}/browse/${formattedIssue}`;
}
