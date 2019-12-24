import { listenForRuntimeMessages, MessageHandlersType, Operation } from "@/shared/extension-message";
import { gitHubController } from '../controllers/github-controller';

const handleGetPullRequests = async ({ issue }: { issue: string }, sender: xbrowser.runtime.MessageSender) => {
  return gitHubController.searchForPullRequest(issue);
};

class InboundMessages {

  private listener!: MessageHandlersType;

  public startListening() {
    /**
     * Map of message handlers for messages sent to the background script.
     */
    this.listener = listenForRuntimeMessages(new Map<Operation, MessageHandlersType>([
      [Operation.GetPullRequests, handleGetPullRequests]
    ]));
  }

  public stopListening() {
    xbrowser.runtime.onMessage.removeListener(this.listener);
  }
}

export const inboundMessages = new InboundMessages();