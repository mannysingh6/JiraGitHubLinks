import { LocalStorageManager } from '@/shared/local-storage-manager';
import { gitHubController } from './controllers/github-controller';

export class PopupApi {

  public login() {
    return gitHubController.login();
  }

  public async logout() {
    await LocalStorageManager.clearAuthData();
    return true;
  }
}

export const popupApi = new PopupApi();
