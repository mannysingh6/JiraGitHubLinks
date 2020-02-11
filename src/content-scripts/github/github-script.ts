import { injectJiraLink } from './core/dom-injector';
import DOMObserver from './core/dom-observer';
import { detectIssue } from './core/issue-detection';
import { inboundMessages } from './messages/background-messages';

class ContentScript {

  private domObserver = new DOMObserver();

  public init = async () => {
    inboundMessages.startListening();
    this.findIssue();
    this.alterLinks();
    this.domObserver.startObserver(document.documentElement, this.domObserverCallback);
  }

  public destruct = () => {
    this.domObserver.stopObserver();
    inboundMessages.stopListening();
  }

  /**
  * This function will be attached to the dom observer and will be called anytime something on the DOM
  * is added or removed. It will also see if the URL has changed for SPAs.
  */
  private domObserverCallback = () => {
    this.findIssue();
    this.alterLinks();
  }

  private findIssue = async () => {
    const issue = detectIssue();
    if (issue) {
      injectJiraLink(issue);
    }
  }

  private alterLinks() {
    const statusLists = document.getElementsByClassName('merge-status-list');
    for (let list of statusLists) {
      const links = list.getElementsByClassName('status-actions');
      for (let link of links) {
        link.setAttribute('target', '_blank');
      }
    }

    const issueLinks = document.getElementsByClassName('issue-link');
    for (let link of issueLinks) {
      link.setAttribute('target', '_blank');
    }
  }
}

export const contentScript = new ContentScript();
