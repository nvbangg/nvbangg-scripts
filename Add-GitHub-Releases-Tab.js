// ==UserScript==
// @name         Add GitHub Releases Tab
// @namespace    https://github.com/nvbangg/nvbangg-scripts
// @version      1.4
// @description  Add Releases tab after Code tab on GitHub repos
// @author       nvbangg (https://github.com/nvbangg)
// @copyright    Copyright (c) 2026 nvbangg (github.com/nvbangg)
// @match        https://github.com/*/*
// @icon         https://github.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562109/Add%20GitHub%20Releases%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/562109/Add%20GitHub%20Releases%20Tab.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const TAB_ID = "releases-tab-link";
  const SVG_ICON = `<path d="M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775Zm1.5 0c0 .066.026.13.073.177l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25ZM6 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"></path>`;

  document.head.insertAdjacentHTML(
    "beforeend",
    `<style>@media(max-width:767px){body.logged-in #${TAB_ID} [data-component="text"],body.logged-in #${TAB_ID} [data-content]{display:none!important}body.logged-in #${TAB_ID}{padding:0 4px!important}}</style>`,
  );

  function insertReleasesTab() {
    const navigationList = document.querySelector('nav[aria-label="Repository"]');
    if (!navigationList || navigationList.querySelector(`#${TAB_ID}, a[href$="/releases"]`)) return;

    const codeTab = navigationList.querySelector('#code-tab, a[data-tab-item="code"]');
    if (!codeTab) return;

    const listItem = codeTab.closest("li") || codeTab;
    const clonedItem = listItem.cloneNode(true);
    const anchorElement = clonedItem.matches("a") ? clonedItem : clonedItem.querySelector("a");

    if (!anchorElement) return;

    const urlParts = location.pathname.split("/");
    if (urlParts.length < 3) return;

    anchorElement.id = TAB_ID;
    anchorElement.href = `/${urlParts[1]}/${urlParts[2]}/releases`;
    anchorElement.setAttribute("aria-label", "Releases");
    anchorElement.setAttribute("data-turbo-frame", "repo-content-turbo-frame");

    ["aria-current", "data-hotkey", "data-react-nav", "data-react-nav-anchor"].forEach((attribute) =>
      anchorElement.removeAttribute(attribute),
    );

    const svgElement = anchorElement.querySelector("svg");
    if (svgElement) svgElement.innerHTML = SVG_ICON;

    const textElement = anchorElement.querySelector('[data-component="text"], [data-content]');
    if (textElement) {
      textElement.textContent = "Releases";
      textElement.setAttribute("data-content", "Releases");
    }

    listItem.after(clonedItem);
  }

  insertReleasesTab();
  new MutationObserver(insertReleasesTab).observe(document.documentElement, { childList: true, subtree: true });
})();
