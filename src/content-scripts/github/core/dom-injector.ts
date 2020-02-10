import { buildJiraLink } from '@/shared/util/jira-util';

export const injectJiraLink = async (issue: string) => {

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

  const url = await buildJiraLink(issue);
  const re = new RegExp(issue, 'ig');
  headerTag.innerHTML = headerTag.innerHTML.replace(re, `<a href="${url}" target="_blank">$&</a>`);
}
