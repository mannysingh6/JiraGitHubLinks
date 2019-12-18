export enum LocalStorageKey {
  AccessToken = 'accessToken'
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
   * Clears the authentication information, such as oauth token from extension storage
   */
  public static clearAuthData(): Promise<void> {
    const keysToRemove = [
      LocalStorageKey.AccessToken
    ];

    return xbrowser.storage.local.remove(keysToRemove);
  }

  /**
   * Reset local storage
   */
  public static resetLocalStorage() {
    return xbrowser.storage.local.remove([
      LocalStorageKey.AccessToken
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
