import { listenForRuntimeMessages, MessageHandlersType, Operation } from "@/shared/extension-message";
import { resetAllTabs } from '@/shared/util/tabs';
import { gitHubController } from '../controllers/github-controller';

const handleLaunchGithubLogin = async () => {
  const success = await gitHubController.login();
  if (success) {
    resetAllTabs();
  }
  return success;
};

const handleGetPullRequests = ({ issue }: { issue: string }, sender: xbrowser.runtime.MessageSender) => {
  return gitHubController.searchForPullRequest(issue);
};

class InboundMessages {

  private listener!: MessageHandlersType;

  public startListening() {
    /**
     * Map of message handlers for messages sent to the background script.
     */
    this.listener = listenForRuntimeMessages(new Map<Operation, MessageHandlersType>([
      [Operation.LaunchGithubLogin, handleLaunchGithubLogin],
      [Operation.GetPullRequests, handleGetPullRequests]
    ]));
  }

  public stopListening() {
    xbrowser.runtime.onMessage.removeListener(this.listener);
  }
}

export const inboundMessages = new InboundMessages();
