import type { PropsWithChildren } from 'react';
import { lazy, Suspense } from 'react';
import type { DocsContainerProps } from '@storybook/addon-docs/blocks';
import { Description, Subtitle, Title } from '@storybook/addon-docs/blocks';
import type { Preview, ReactRenderer } from '@storybook/react-vite';
import { useStoryPageDecorator } from './components/useStoryPageDecorator';
import { ensureStoryI18n } from './locales';
import './global-styles.css';
import './story-styles.css';
// @ts-expect-error
import 'antd/dist/reset.css';

ensureStoryI18n();

const ThemedDocsContainer = lazy(() => import('./components/DocPageContainer'));

const preview: Preview = {
  initialGlobals: {
    storyLocale: '',
    theme: '',
  },
  globalTypes: {
    storyLocale: {
      description: 'Internationalization locale',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en-US', title: 'English (US)', right: '🇺🇸' },
          { value: 'zh-CN', title: '简体中文', right: '🇨🇳' },
        ],
      },
    },
    theme: {
      description: 'Story theme',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', right: '☀️' },
          { value: 'dark', title: 'Dark', right: '🌙' },
        ],
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    docs: {
      container: (props: PropsWithChildren<DocsContainerProps<ReactRenderer>>) => (
        <Suspense fallback={null}>
          <ThemedDocsContainer {...props} />
        </Suspense>
      ),
      page: () => {
        return (
          <>
            <Title />
            <Subtitle />
            <Description />
          </>
        );
      },
    },
  },
  decorators: [(Story, context) => useStoryPageDecorator(Story, context)],
};

export default preview;
