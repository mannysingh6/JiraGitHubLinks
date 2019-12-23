import { LocalStorageManager } from '@/shared/local-storage-manager';
import { doGithubLogin } from './rest/auth';

export class PopupApi {
  public login() {
    return doGithubLogin();
  }
  public async logout() {
    await LocalStorageManager.clearAuthData();
    return true;
  }
}

export const popupApi = new PopupApi();
