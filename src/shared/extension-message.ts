/**
 * Operations for extension messages
 */
export enum Operation {
  Unknown,
  LaunchGithubLogin,
  ResetContentScript,
  GetPullRequests,
}

/**
 * Base class for all messages.  Includes the operation and an optional data.
 */
export interface ExtensionMessage<T> {
  operation: Operation;
  data?: T;
}

/**
 * Since the polyfill for xbrowser.runtime.onMessage sends both the response (Promise.resolve) and the error (Promise.reject) back
 * through as a response rather than keeping them separate (i.e., the receiving side won't know the difference between a success
 * and a failure, so it will not properly throw errors) use the SendMessageResponse as a workaround so that the receiving side
 * can check to see if the returned value contains an error and then throw it, or simply return the response.
 * See xbrowser.runtime.onMessage.addListener and sendRuntimeMessage for more info.
 */
export interface SendMessageResponse {
  /**
   * Response from sendMessage.  This may be success or failure (a failure can be sent back rather than thrown).
   */
  response?: any;

  /**
   * This is any thrown error that was caught inside the onMessage handler that should be re-thrown on the receiving side.
   */
  error?: any;
}

const deserializeData = <T>(data: T) => {
  return data;
}

export type MessageHandlersType<T = any> = (data: T, sender: xbrowser.runtime.MessageSender) => Promise<any> | boolean | void;
export const listenForRuntimeMessages = (messageHandlers: Map<Operation, MessageHandlersType<any>>) => {
  /**
   * Handles incoming messages sent from the content script & popup.
   */
  const listener = (message: ExtensionMessage<any>, sender: xbrowser.runtime.MessageSender) => {
    if (message && message.operation) {
      const fn = messageHandlers.get(message.operation);
      if (fn) {
        if (window.debugMessaging) {
          console.log(`Incoming message: ${Operation[message.operation]}`, message);
        }
        try {
          return (async () => {
            const data = deserializeData<any>(message.data);
            const response = await fn(data, sender);
            if (window.debugMessaging) {
              console.log(`Sending response: ${Operation[message.operation]}`, response);
            }
            return { response: response } as SendMessageResponse;
          })();
        }
        catch (err) {
          // The polyfill for xbrowser.runtime.onMessage treats thrown errors/Promise.reject the same as a response, so
          // wrap it and send back to be thrown on the receiving side.
          return (async () => {
            console.log(`Sending response as error: ${Operation[message.operation]}`, err);
            return { error: err } as SendMessageResponse;
          })();
        }
      }
    }

    return false;
  };
  xbrowser.runtime.onMessage.addListener(listener);
  return listener;
};

export const sendRuntimeMessage = async <T>(message: ExtensionMessage<any>) => {
  if (window.debugMessaging) {
    console.log(`Sending message: ${Operation[message.operation]}`, message);
  }
  const response = await xbrowser.runtime.sendMessage(message);
  return getDeserializedResponseOrThrow<T>(response);
};

export const sendTabMessage = async <T>(tabId: number, message: ExtensionMessage<any>, options?: {
  frameId?: number;
}) => {
  if (window.debugMessaging) {
    console.log(`Sending message to tab ${tabId}: ${Operation[message.operation]}`, message);
  }

  try {
    const response = await xbrowser.tabs.sendMessage(tabId, message, options);
    return getDeserializedResponseOrThrow<T>(response);
  } catch (error) {
    if (error && error.message && error.message === 'Could not establish connection. Receiving end does not exist.') {
      // This error mostly got thrown because our content script hasn't been injected in this tab, ignore these errors.
      return getDeserializedResponseOrThrow<T>({ response: null });
    }
    throw error;
  }
};

/**
 * Returns the deserialized response or throws an error.
 *
 * @template T The type.
 * @param response The response to investigate to determine whether to throw an error or not.
 * @returns The response if no error was found.
 */
function getDeserializedResponseOrThrow<T>(response: SendMessageResponse): T {
  // Ensure the response is defined.
  if (!response) {
    throw new Error('Received null from sendMessage.');
  }

  // Since the polyfill for xbrowser.runtime.onMessage sends both the response (Promise.resolve) and the error (Promise.reject) back
  // through as a response rather than keeping them separate, i.e., we don't know if the response received here is a success
  // or a failure without using the SendMessageResponse as a workaround so that we can check to see if the returned value
  // contains an error and then re-throw it.
  if (response.error) {
    // Re-throw error
    throw response.error;
  }

  // No error found, so return the data.
  return deserializeData(response.response);
}
