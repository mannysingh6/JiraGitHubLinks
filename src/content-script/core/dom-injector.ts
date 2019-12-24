import { PullRequest } from '@/shared/models/pull-request';

const panelId = 'JGL-github-pull-requests';

export const injectPullRequests = (pullRequests: PullRequest[]) => {

  const existingPanel = document.getElementById(panelId);
  if (existingPanel) {
    existingPanel.parentNode?.removeChild(existingPanel);
  }

  const successOne = tryInjectionOne(pullRequests);
  if (successOne) {
    return true;
  }

  const successTwo = tryInjectionTwo(pullRequests);
  if (successTwo) {
    return true;
  }

  return false;
}

const tryInjectionOne = (pullRequests: PullRequest[]) => {
  const container = document.getElementById('viewissuesidebar');

  if (!container) {
    return false;
  }

  const panelElement = document.createElement('div');
  panelElement.id = panelId;
  panelElement.className = 'module toggle-wrap';

  const headerDivElement = document.createElement('div');
  headerDivElement.className = 'mod-header';
  headerDivElement.innerHTML = `<ul class="ops"></ul>
  <a href="#" class="aui-button toggle-title" resolved=""> \
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"> \
      <g fill="none" fill-rule="evenodd" data-darkreader-inline-fill="" style="--darkreader-inline-fill:none;"> \
      <path d="M3.29175 4.793c-.389.392-.389 1.027 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955c.388-.392.388-1.027 0-1.419-.389-.392-1.018-.392-1.406 0l-2.298 2.317-2.307-2.327c-.194-.195-.449-.293-.703-.293-.255 0-.51.098-.703.293z" fill="#344563" data-darkreader-inline-fill="" style="--darkreader-inline-fill:#b3c0c9;"> \
      </path> \
      </g> \
    </svg> \
  </a> \
  <h4 class="toggle-title">Pull Requests</h4>`;

  panelElement.appendChild(headerDivElement);

  const contentDiv = document.createElement('div');
  contentDiv.className = 'mod-content';

  const itemDetails = document.createElement('div');
  itemDetails.className = 'item-details';
  itemDetails.innerHTML = buildPullRequestsList(pullRequests);
  contentDiv.appendChild(itemDetails);

  panelElement.appendChild(contentDiv);
  container.appendChild(panelElement);

  return true;
}

const tryInjectionTwo = (pullRequests: PullRequest[]) => {
  const container = document.getElementById('ghx-detail-view');
  if (!container) {
    return false;
  }

  const navContentDiv = document.getElementById('js-detail-nav-content');
  if (!navContentDiv) {
    return false;
  }

  const subTasksContainer = document.getElementById('SUB_TASKS');
  if (!subTasksContainer) {
    return false;
  }

  const panelElement = document.createElement('div');
  panelElement.id = panelId;
  panelElement.className = 'module toggle-wrap ghx-detail-section expanded';

  const headerDivElement = document.createElement('div');
  headerDivElement.className = 'mod-header';
  headerDivElement.innerHTML = `<ul class="ops"></ul>
  <a href="#" class="aui-button toggle-title" resolved="">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
      <g fill="none" fill-rule="evenodd">
      <path d="M3.29175 4.793c-.389.392-.389 1.027 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955c.388-.392.388-1.027 0-1.419-.389-.392-1.018-.392-1.406 0l-2.298 2.317-2.307-2.327c-.194-.195-.449-.293-.703-.293-.255 0-.51.098-.703.293z" fill="#344563"></path>
      </g>
    </svg>
  </a>
  <h4 class="toggle-title">Pull Requests</h4>`;

  panelElement.appendChild(headerDivElement);

  const contentDiv = document.createElement('div');
  contentDiv.className = 'mod-content';
  contentDiv.style.paddingLeft = '20px';
  contentDiv.innerHTML = buildPullRequestsList(pullRequests);

  panelElement.appendChild(contentDiv);
  subTasksContainer.appendChild(panelElement);

  return true;
}

const buildPullRequestsList = (pullRequests: PullRequest[]) => {
  const items = pullRequests.reduce((pv, cv) => {
    return `${pv}<li><a href="${cv.html_url}" target="_blank">#${cv.number}: ${cv.title}</a></li>`
  }, '');
  return `<ul style="margin:0; padding: 0">${items}</ul>`;
}
