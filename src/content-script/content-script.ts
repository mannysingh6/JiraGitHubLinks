import { Operation, sendRuntimeMessage } from '@/shared/extension-message';
import { PullRequest } from '@/shared/models/pull-request';
import { RestResponse } from '@/shared/models/rest-response';
import DOMObserver from './core/dom-observer';
import { inboundMessages } from './messages/background-messages';

class ContentScript {

  private domObserver = new DOMObserver();

  public init = async () => {
    inboundMessages.startListening();
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
  private domObserverCallback = async () => {
    console.log('DOM OBSERVER CALLBACK');

    const response = await sendRuntimeMessage<RestResponse<PullRequest[]>>({
      operation: Operation.GetPullRequests,
      data: {
        url: document.URL
      }
    });
    console.log('response', response);
  }
}

export const contentScript = new ContentScript();
