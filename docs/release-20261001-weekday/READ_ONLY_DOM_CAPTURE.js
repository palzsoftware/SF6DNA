// Paste this expression into DevTools on the failing page. No storage/network/DOM writes.
(() => {
  const root = document.documentElement;
  const viewport = root.clientWidth;
  const describe = (element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    let ancestor = element.parentElement;
    while (ancestor && !/auto|scroll/.test(getComputedStyle(ancestor).overflowX)) {
      ancestor = ancestor.parentElement;
    }
    return {
      tag: element.tagName, id: element.id, class: element.className,
      left: rect.left, right: rect.right, width: rect.width,
      scrollWidth: element.scrollWidth, clientWidth: element.clientWidth,
      computed: Object.fromEntries([
        'width', 'minWidth', 'maxWidth', 'margin', 'padding', 'transform',
        'position', 'display', 'gridTemplateColumns', 'flex', 'flexShrink', 'whiteSpace', 'overflowX',
      ].map(key => [key, style[key]])),
      scrollAncestor: ancestor ? {
        tag: ancestor.tagName, id: ancestor.id, class: ancestor.className,
        clientWidth: ancestor.clientWidth, scrollWidth: ancestor.scrollWidth,
        overflowX: getComputedStyle(ancestor).overflowX,
      } : null,
    };
  };
  return JSON.stringify({
    capturedAt: new Date().toISOString(),
    // Exclude URL queries, account details, DOM text, and stored personal settings.
    path: location.pathname, userAgent: navigator.userAgent,
    innerWidth, clientWidth: viewport, scrollWidth: root.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    visualViewport: window.visualViewport ? {
      width: window.visualViewport.width, scale: window.visualViewport.scale,
    } : null,
    theme: root.dataset.theme, appearance: root.dataset.appearance,
    offenders: [...document.querySelectorAll('body *')].filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && (rect.right > viewport + 1 || rect.left < -1);
    }).map(describe),
  }, null, 2);
})();
