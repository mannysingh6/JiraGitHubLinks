import { Command } from './models/command';
import { User } from './models/user';

export enum LocalStorageKey {
  AccessToken = 'accessToken',
  User = 'user',
  JiraUrl = 'jiraUrl',
  Commands = 'commands',
  ProjectKeys = 'projectKeys',
  DefaultKey = 'defaultKey'
}

export class LocalStorageManager {

  /**
   * Gets the token from storage.
   */
  public static getToken(): Promise<string> {
    return this.get<string>(LocalStorageKey.AccessToken, '');
  }

  /**
   * Sets the token in storage.
   */
  public static setToken(token: string): Promise<void> {
    return this.set(LocalStorageKey.AccessToken, token);
  }

  /**
   * Gets the user from storage.
   */
  public static getUser(): Promise<User | undefined> {
    return this.get<User | undefined>(LocalStorageKey.User, undefined);
  }

  /**
   * Sets the user in storage.
   */
  public static setUser(user: User): Promise<void> {
    return this.set(LocalStorageKey.User, user);
  }

  public static getJiraUrl(): Promise<string> {
    return this.get<string>(LocalStorageKey.JiraUrl, 'https://jira.tc.lenovo.com');
  }

  public static setJiraUrl(url: string): Promise<void> {
    return this.set(LocalStorageKey.JiraUrl, url);
  }

  public static getCommands(): Promise<Command[]> {
    return this.get<Command[]>(LocalStorageKey.Commands, []);
  }

  public static setCommands(commands: Command[]): Promise<void> {
    return this.set(LocalStorageKey.Commands, commands);
  }

  public static getProjectKeys(): Promise<string> {
    return this.get<string>(LocalStorageKey.ProjectKeys, 'LUW,LSA,TEAMAC,CSS');
  }

  public static setProjectKeys(keys: string): Promise<void> {
    return this.set(LocalStorageKey.ProjectKeys, keys);
  }

  public static getDefaultKey(): Promise<string> {
    return this.get<string>(LocalStorageKey.DefaultKey, 'LUW');
  }

  public static setDefaultKey(key: string): Promise<void> {
    return this.set(LocalStorageKey.DefaultKey, key);
  }

  /**
   * Clears the authentication information, such as oauth token from extension storage
   */
  public static clearAuthData(): Promise<void> {
    const keysToRemove = [
      LocalStorageKey.AccessToken,
      LocalStorageKey.User
    ];

    return xbrowser.storage.local.remove(keysToRemove);
  }

  /**
   * Reset local storage
   */
  public static resetLocalStorage() {
    return xbrowser.storage.local.remove([
      LocalStorageKey.AccessToken,
      LocalStorageKey.User,
      LocalStorageKey.JiraUrl,
      LocalStorageKey.Commands
    ]);
  }

  /**
 * Gets the key from storage. If the key is not present, return the default value.
 *
 * @param key
 * @param defaultValue
 */
  private static async get<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const results = await xbrowser.storage.local.get(key);
      const data: T = results[key] || defaultValue;
      return data;
    }
    catch (e) {
      return defaultValue;
    }
  }

  /**
   * Sets the key in storage with the provided value.
   *
   * @param key
   * @param value
   */
  private static async set<T>(key: string, value: T): Promise<void> {
    try {
      await xbrowser.storage.local.set({ [key]: value });
    }
    catch (e) {
      console.error(`Could not save data in storage: ${key}`, e)
    }
  }
}
