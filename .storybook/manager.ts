import type { API_ComponentEntry } from 'storybook/internal/types';
import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import docTitles from './docs/titles.json';
import storyTitles from './stories/titles.json';
import { getGlobalValueFromUrl } from './utils/global';
import { dark, light } from './utils/themes';
import './global-styles.css';

const globalTheme = getGlobalValueFromUrl('theme');
const globalLocale = getGlobalValueFromUrl('storyLocale');
const isPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = (!globalTheme && isPreferDark) || globalTheme === 'dark' ? 'dark' : 'light';

// Merge docs + story titles into one lookup table. Story meta titles are
// hierarchical ("Demo / CLI Usage") while the sidebar renders the leaf name,
// so strip the leading group segment for matching.
const sidebarTitles: Array<{
  fileName: string;
  title?: string;
  titleCN?: string;
  rawTitle?: string;
  rawTitleCN?: string;
}> = [
  ...docTitles,
  ...(storyTitles as Array<{ fileName: string; title?: string; titleCN?: string }>).map((story) => ({
    fileName: story.fileName,
    title: story.title?.replace(/^[^/]*\/\s*/, ''),
    titleCN: story.titleCN?.replace(/^[^/]*\/\s*/, ''),
    rawTitle: story.title,
    rawTitleCN: story.titleCN,
  })),
];

document.documentElement.dataset.theme = theme;

addons.setConfig({
  layoutCustomisations: {
    showPanel: () => false,
  },
  sidebar: {
    renderLabel: (options) => {
      if (globalLocale === 'zh-CN') {
        const importPath = (options as API_ComponentEntry).importPath;
        const matchItem = sidebarTitles.find(
          (item) => `./${item.fileName}` === importPath && item.title === options.name
        );
        if (matchItem && matchItem.titleCN) {
          return matchItem.titleCN;
        }
        // 分组（root）条目没有 importPath：用 options.name 匹配原始 title 的第一段
        if (!importPath) {
          const groupMatch = sidebarTitles.find(
            (item) => item.rawTitle?.split('/')[0]?.trim() === options.name && item.rawTitleCN?.includes('/')
          );
          if (groupMatch) {
            const groupCN = groupMatch.rawTitleCN?.split('/')[0]?.trim();
            if (groupCN) {
              return groupCN;
            }
          }
        }
      }
      return options.name;
    },
  },
  theme: createManagerTheme(theme),
});

function createManagerTheme(themeName: 'light' | 'dark') {
  if (theme === 'dark') {
    return create(dark);
  }
  return create(light);
}

function monitorTitleChanges() {
  const observer = new MutationObserver(() => {
    const titleEl = document.querySelector('title');
    if (titleEl && titleEl.textContent?.endsWith('⋅ Storybook')) {
      titleEl.textContent = titleEl.textContent.replace('⋅ Storybook', `⋅ ${light.brandTitle}`);
    }
  });
  observer.observe(document.head, { childList: true, subtree: true });
}

monitorTitleChanges();
