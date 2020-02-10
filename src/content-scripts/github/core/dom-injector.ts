export const injectJiraLink = (issue: string) => {

  const headerDiv = document.getElementById('partial-discussion-header');
  if (!headerDiv) {
    return false;
  }

  const headerTag = headerDiv.querySelector('h1.gh-header-title');
  if (!headerTag) {
    return false;
  }

  if (headerTag.getElementsByTagName('a').length > 0) {
    return true;
  }

  const jiraLink = issue.replace(' ', '-');
  const re = new RegExp(issue, 'ig');
  headerTag.innerHTML = headerTag.innerHTML.replace(re, `<a href="https://jira.tc.lenovo.com/browse/${jiraLink}" target="_blank">$&</a>`);
}
