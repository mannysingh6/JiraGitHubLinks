/**
 * popup-api-util.ts
 *
 * The enclosed material is Lenovo confidential and is the sole property of Lenovo.
 * Unauthorized disclosure, distribution or other use of this material is expressly prohibited.
 *
 * © 2019 Lenovo Group Ltd.
 *
 * Created on June 24, 2019.
 */

/**
 * Returns the PopupApi from the background page
 */
export const getPopupApi = async () => {
  const backgroundPage = await xbrowser.runtime.getBackgroundPage();
  const popupApi = backgroundPage.getPopupApi;
  return popupApi;
};
