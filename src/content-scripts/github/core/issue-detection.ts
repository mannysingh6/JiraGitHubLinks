export const detectIssue = () => {

  const headerDiv = document.getElementById('partial-discussion-header');
  if (!headerDiv) {
    return false;
  }

  const innerText = headerDiv.innerText;
  const matches = innerText.match(/([A-Z]{2,10}\-[0-9]+)+/ig);
  if (matches && matches.length > 0) {
    return matches[0];
  }

  return false;
}
