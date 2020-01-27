import { Operation, sendTabMessage } from '../extension-message';

export const getAllTabs = (): Promise<xbrowser.tabs.Tab[]> => {
  return xbrowser.tabs.query({ url: ['*://jira.tc.lenovo.com/*', '*://jira.stone-ware.com/*', '*://*.atlassian.net/*', 'https://github.com/*/*/pull/*'] });
};

export const resetAllTabs = async () => {
  const tabs = await getAllTabs();
  tabs.forEach(tab => {
    sendTabMessage(tab.id!, { operation: Operation.ResetJiraContentScript });
    sendTabMessage(tab.id!, { operation: Operation.ResetGithubContentScript });
  });
};

export const getActiveTab = async (): Promise<xbrowser.tabs.Tab | null> => {
  const tabs = await xbrowser.tabs.query({
    currentWindow: true,
    active: true,
    windowType: 'normal'
  });

  const activeTab = tabs[0];

  if (activeTab) {
    return activeTab;
  }

  return null;
};
