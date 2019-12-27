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

  const searchValue = issue.replace('-', '.');
  const re = new RegExp(searchValue, 'ig');
  headerTag.innerHTML = headerTag.innerHTML.replace(re, `<a href="https://jira.tc.lenovo.com/browse/${issue}" target="_blank">$&</a>`);
}
