class SpotlightController {

  public spotlightFrame?: HTMLIFrameElement;
  public iframeId = 'lenovo-ext-spotlight-iframe';

  public toggleIframe = () => {
    const existingFrame = document.getElementById(this.iframeId);
    if (existingFrame) {
      existingFrame.style.display = (existingFrame.style.display === 'block') ? 'none' : 'block';
      return;
    }

    this.spotlightFrame = document.createElement('iframe');
    this.spotlightFrame.id = this.iframeId;
    this.spotlightFrame.src = xbrowser.runtime.getURL('spotlight.html');
    Object.assign(this.spotlightFrame.style, {
      position: 'fixed',
      width: '100%',
      height: '100%',
      border: 'none',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      'z-index': 99999999999,
      display: 'block'
    });
    document.getElementsByTagName('body')[0].appendChild(this.spotlightFrame);
  }
}

export const spotlightController = new SpotlightController();
