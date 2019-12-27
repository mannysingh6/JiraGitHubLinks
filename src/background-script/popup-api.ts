import { resetAllTabs } from '@/shared/util/tabs';
import { gitHubController } from './controllers/github-controller';

export class PopupApi {

  public async login() {
    const success = await gitHubController.login();
    if (success) {
      resetAllTabs();
    }
    return success;
  }

  public async logout() {
    await gitHubController.logout();
    return true;
  }
}

export const popupApi = new PopupApi();
