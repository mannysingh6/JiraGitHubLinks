export function throttle(func: Function, limit: number) {
  let lastFunc: number
  let lastRan: number;
  return function (this: any) {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = window.setTimeout(function () {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

export function debounce(func: Function, delay: number) {
  let inDebounce: number;
  return function (this: any) {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = window.setTimeout(() => func.apply(context, args), delay);
  };
}
