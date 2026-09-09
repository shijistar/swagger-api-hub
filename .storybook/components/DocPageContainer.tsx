import type { PropsWithChildren } from 'react';
import { useEffect, useMemo } from 'react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import type { ReactRenderer } from '@storybook/react-vite';
import { ConfigProvider } from 'antd';
import darkAlgorithm from 'antd/es/theme/themes/dark';
import defaultAlgorithm from 'antd/es/theme/themes/default';
import { storyI18n } from '../locales';
import { dark, light } from '../utils/themes';

interface ThemedDocsContainerProps extends DocsContainerProps<ReactRenderer> {}

let currentTheme: string | undefined = undefined;

export const DocPageContainer = (props: PropsWithChildren<ThemedDocsContainerProps>) => {
  const className = useMemo(() => 'sb-docs-container', []);
  // @ts-expect-error: because store is an internal api
  const localeKey = props.context.store?.userGlobals.globals.storyLocale;
  // @ts-expect-error: because store is an internal api
  const themeKey = props.context.store?.userGlobals.globals.theme;
  const isPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = (!themeKey && isPreferDark) || themeKey === 'dark' ? 'dark' : 'light';
  const isDark = theme === 'dark';
  const themeName = isDark ? 'dark' : 'light';

  // Reload the page if the theme changes.
  useEffect(() => {
    if (!currentTheme) {
      currentTheme = themeName;
    }
    if (themeName !== currentTheme) {
      currentTheme = themeName;
      (window.top ?? window.parent ?? window).location.reload();
    }
  }, [themeName]);

  useEffect(() => {
    if (localeKey && storyI18n.language !== localeKey) {
      void storyI18n.changeLanguage(localeKey).then(() => {
        (window.top ?? window.parent ?? window).location.reload();
      });
    }
  }, [localeKey]);

  // Sync dark mode class onto the iframe documentElement. Docs pages do
  // not go through the story decorator, so this must happen here.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.dataset.theme = themeName;
  }, [isDark, themeName]);

  return (
    <div className={className}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
          token: {
            fontSize: 16,
            fontFamily: 'SF Pro Display, Segoe UI, PingFang SC, Helvetica Neue, Arial, sans-serif',
          },
        }}
      >
        <DocsContainer {...props} theme={isDark ? dark : light}>
          {props.children}
        </DocsContainer>
      </ConfigProvider>
    </div>
  );
};

export default DocPageContainer;
