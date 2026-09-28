// ==UserScript==
// @name         Bypass Google Redirect
// @namespace    https://github.com/nvbangg/nvbangg-scripts
// @version      1.0
// @description  Bypass Google Redirect Notice
// @author       nvbangg (https://github.com/nvbangg)
// @copyright    Copyright (c) 2026 nvbangg (github.com/nvbangg)
// @match        https://docs.google.com/*
// @match        https://www.google.com/url*
// @match        https://google.com/url*
// @run-at       document-start
// @grant        none
// @license      MIT
// ==/UserScript==

(() => {
  "use strict";

  function direct(url) {
    try {
      const u = new URL(url, location.href);

      if ((u.hostname === "google.com" || u.hostname === "www.google.com") && u.pathname === "/url") {
        return u.searchParams.get("q") || u.searchParams.get("url") || url;
      }
    } catch {}

    return url;
  }

  // Chrome restored an existing google.com/url tab.
  if (location.pathname === "/url") {
    const target = direct(location.href);

    if (target !== location.href) {
      location.replace(target);
      return;
    }
  }

  // Catch Google Docs opening links through window.open().
  const originalOpen = window.open;

  window.open = function (url, ...args) {
    return originalOpen.call(this, direct(url), ...args);
  };

  // Rewrite normal links before they are opened.
  function rewrite(link) {
    if (link?.href) {
      link.href = direct(link.href);
    }
  }

  for (const event of ["pointerdown", "click", "auxclick", "contextmenu"]) {
    document.addEventListener(
      event,
      (e) => {
        rewrite(e.target.closest?.("a[href]"));
      },
      true,
    );
  }

  // Also handle links opened programmatically.
  const originalClick = HTMLAnchorElement.prototype.click;

  HTMLAnchorElement.prototype.click = function () {
    rewrite(this);
    return originalClick.call(this);
  };
})();
