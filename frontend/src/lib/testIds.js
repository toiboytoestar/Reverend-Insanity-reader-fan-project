export const TID = {
  // Global
  siteLogo: "site-logo",
  navToc: "nav-toc",
  navBookmarks: "nav-bookmarks",
  navHistory: "nav-history",
  navHome: "nav-home",

  // Progress card
  overallProgressCard: "overall-progress-card",
  overallProgressPct: "overall-progress-pct",

  // History
  historyItem: (id) => `history-item-${id}`,
  historyClearBtn: "history-clear-btn",

  // Reader distraction free
  readerFullscreenBtn: "reader-fullscreen-btn",
  readerExitFullscreenBtn: "reader-exit-fullscreen-btn",

  // Landing
  continueReadingBtn: "continue-reading-btn",
  startReadingBtn: "start-reading-btn",
  browseTocBtn: "browse-toc-btn",

  // ToC
  chapterSearchInput: "chapter-search-input",
  chapterFilterAll: "chapter-filter-all",
  chapterFilterUnread: "chapter-filter-unread",
  chapterFilterRead: "chapter-filter-read",
  chapterFilterBookmarked: "chapter-filter-bookmarked",
  chapterCard: (id) => `chapter-card-${id}`,
  chapterListItem: (id) => `chapter-item-${id}`,

  // Reader
  readerContainer: "reader-container",
  readerTitle: "reader-title",
  readerContent: "reader-content",
  readerProgress: "reader-progress",
  readerPrev: "reader-prev-btn",
  readerNext: "reader-next-btn",
  readerBookmark: "reader-bookmark-btn",
  readerSettingsBtn: "reader-settings-btn",
  readerTocBtn: "reader-toc-btn",
  readerBackBtn: "reader-back-btn",
  readerShortcutsBtn: "reader-shortcuts-btn",

  // Settings panel
  settingsPanel: "settings-panel",
  themeSelector: (t) => `theme-selector-${t}`,
  fontFamilySelector: (t) => `font-family-${t}`,
  fontSizeUp: "font-size-increase",
  fontSizeDown: "font-size-decrease",
  lineHeightSlider: "line-height-slider",
  widthSelector: (w) => `width-selector-${w}`,
  resetSettingsBtn: "reset-settings-btn",

  // ToC drawer
  tocDrawer: "toc-drawer",
  tocDrawerSearch: "toc-drawer-search",

  // Bookmarks
  bookmarkListItem: (id) => `bookmark-item-${id}`,
  bookmarkRemove: (id) => `bookmark-remove-${id}`,
  bookmarkNoteInput: (id) => `bookmark-note-${id}`,
};
