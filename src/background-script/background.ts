import { getRepos } from './rest/github';

export class Background {

  public async init() {
    xbrowser.browserAction.onClicked.addListener(async () => {
      const repos = await getRepos();
      console.log('repos', repos);
    });
  }
}

export const background = new Background();
