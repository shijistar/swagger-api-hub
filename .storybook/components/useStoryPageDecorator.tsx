import { lazy, Suspense, useEffect, useState } from 'react';
import type { ReactRenderer } from '@storybook/react-vite';
import darkAlgorithm from 'antd/es/theme/themes/dark';
import defaultAlgorithm from 'antd/es/theme/themes/default';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import type { StoryContext } from 'storybook/internal/csf';
import { storyI18n } from '../locales';
import { dark, getThemeKey, light } from '../utils/themes';

const AppLazy = lazy(() => import('antd/es/app'));
const ConfigProviderLazy = lazy(() => import('antd/es/config-provider'));

/**
 * swagger-api-hub story decorator: keeps the manager theme in sync and reloads the iframe when the
 * locale toolbar is toggled, so docs/stories pick up the new language without stale i18next state.
 */
function useStoryPageDecorator(Story: React.ComponentType, context: StoryContext<ReactRenderer>) {
  const localeKey = context.globals.storyLocale === 'zh-CN' ? 'zh-CN' : 'en-US';
  const locale = localeKey === 'zh-CN' ? zhCN : enUS;
  const themeKey = getThemeKey(context.globals.theme);
  const isPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = (!themeKey && isPreferDark) || themeKey === 'dark' ? 'dark' : 'light';
  const isDark = theme === 'dark';
  const themeName = isDark ? 'dark' : 'light';
  const [prevTheme, setPrevTheme] = useState(themeName);

  useEffect(() => {
    if (storyI18n.language !== localeKey) {
      void storyI18n.changeLanguage(localeKey).then(() => {
        (window.top ?? window.parent ?? window).location.reload();
      });
    }
  }, [localeKey]);

  // Reload the page if the theme changes.
  useEffect(() => {
    if (themeName && themeName !== prevTheme) {
      setPrevTheme(themeName);
      (window.top ?? window.parent ?? window).location.reload();
    }
  }, [themeName, prevTheme]);

  // Sync dark mode class onto the iframe documentElement so CSS and
  // components can pick up the theme. The manager frame sets its own
  // data-theme, but the story iframe is separate.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.dataset.theme = themeName;
  }, [isDark, themeName]);

  return (
    <Suspense fallback={null}>
      <ConfigProviderLazy
        locale={locale}
        theme={{
          algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
          token: {
            colorPrimary: isDark ? dark.colorPrimary : light.colorPrimary,
            fontSize: 16,
          },
        }}
      >
        <AppLazy>
          <Story />
        </AppLazy>
      </ConfigProviderLazy>
    </Suspense>
  );
}

export { useStoryPageDecorator };
export default useStoryPageDecorator;
