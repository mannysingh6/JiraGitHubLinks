export const findJiraIssue = (str: string) => {
  const matches = str.match(/(^|\s)([A-Z]{2,10}(\-|\W)[0-9|.]+)+($|\s)/ig);
  if (matches && matches.length > 0) {
    return matches[0].trim().replace(/\./g, '');
  }
}
