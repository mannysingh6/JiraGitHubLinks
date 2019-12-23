export const detectIssue = async () => {
  const xdContext = await injectScript();
  if (xdContext) {
    const issue = xdContext.issue;
    if (issue) {
      return issue;
    }
  }
  return false;
}

interface XDContext {
  issue: string;
}
const injectScript = (): Promise<XDContext> => {
  return new Promise((resolve, reject) => {
    const id = 'JGL-global-variable-access';
    const code = `\
      setTimeout(function () { \
        document.dispatchEvent(new CustomEvent('${id}', { \
          detail: window.xdContext \
        })); \
      }, 0); \
    `;

    document.getElementById(id)?.remove();
    const s = document.createElement('script');
    const inlineScript = document.createTextNode(code);
    s.id = id;
    s.type = 'text/javascript';
    s.appendChild(inlineScript);

    (document.head || document.documentElement).appendChild(s);

    const listener = (e: any) => {
      s.parentNode?.removeChild(s);
      document.removeEventListener(id, listener);
      resolve(e.detail);
    }
    document.addEventListener(id, listener);
  });
}
