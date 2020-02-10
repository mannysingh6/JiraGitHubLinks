import { listenForRuntimeMessages, MessageHandlersType, Operation } from "@/shared/extension-message";
import { LocalStorageManager } from '@/shared/local-storage-manager';
import { Command } from '@/shared/models/command';
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

const handleGetListOfCommands = async (): Promise<Command[]> => {
  return LocalStorageManager.getCommands();
};

const handleExecuteCommand = async ({ cmd }: { cmd: string }, sender: xbrowser.runtime.MessageSender) => {
  console.log('execute command:', cmd);
  const commands = await LocalStorageManager.getCommands();
  const result = commands.find(c => c.name === cmd);
  if (result) {
    const url = result.url;
    xbrowser.tabs.create({ url });
  }
};

class InboundMessages {

  private listener!: MessageHandlersType;

  public startListening() {
    /**
     * Map of message handlers for messages sent to the background script.
     */
    this.listener = listenForRuntimeMessages(new Map<Operation, MessageHandlersType>([
      [Operation.LaunchGithubLogin, handleLaunchGithubLogin],
      [Operation.GetPullRequests, handleGetPullRequests],
      [Operation.GetListOfCommands, handleGetListOfCommands],
      [Operation.ExecuteCommand, handleExecuteCommand]
    ]));
  }

  public stopListening() {
    xbrowser.runtime.onMessage.removeListener(this.listener);
  }
}

export const inboundMessages = new InboundMessages();
