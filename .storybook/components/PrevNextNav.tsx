import { type MouseEvent, useEffect, useState } from 'react';
import { linkTo } from '@storybook/addon-links';
import { theme } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useStoryLocale, useStoryT } from '../locales';

export interface NavItem {
  /** Story id prefix used to match the current page (e.g. "introduce"). */
  key: string;
  /** Full story id used for the href (e.g. "introduce--docs"). */
  id: string;
  /** Whether the target is a docs page or a story page. */
  type: 'docs' | 'story';
  title: string;
  titleCN: string;
}

interface PrevNextNavProps {
  /** Current page story id prefix. */
  current: string;
  /**
   * Ordered navigation chain. Pages NOT listed here (e.g. Changelog) get no prev/next navigation at
   * all.
   */
  items: NavItem[];
}

/**
 * Bottom prev/next navigation shared by docs pages (rendered inside DocPageContainer) and demo
 * stories (rendered inside the story decorator).
 *
 * The storybook iframe is first loaded without an `id` query param and the final id is set later
 * via history.replaceState (which fires no event), so the caller should resolve the current key
 * with useCurrentStoryKey().
 */
export const PrevNextNav = ({ current, items }: PrevNextNavProps) => {
  const t = useStoryT();
  const isZh = useStoryLocale() === 'zh-CN';
  const idx = items.findIndex((item) => item.key === current);
  const { token } = theme.useToken();

  // Pages outside the navigation chain (e.g. Changelog) show no navigation.
  if (idx === -1) {
    return null;
  }

  const prev = idx > 0 ? items[idx - 1] : undefined;
  const next = idx < items.length - 1 ? items[idx + 1] : undefined;

  const href = (item: NavItem) => (item.type === 'docs' ? `?path=/docs/${item.id}` : `?path=/story/${item.id}`);
  const label = (item: NavItem) => (isZh ? item.titleCN : item.title);
  // Navigate through the storybook channel so the manager switches pages
  // instead of letting the iframe follow a relative ?path= URL.
  const go = (event: MouseEvent, item: NavItem) => {
    event.preventDefault();
    linkTo(item.id)();
  };

  return (
    <div className="sb-prevnext">
      {prev && (
        <a className="sb-prevnext-item sb-prevnext-prev" href={href(prev)} onClick={(e) => go(e, prev)}>
          <span className="sb-prevnext-direction">
            <ArrowLeftOutlined /> {t('story.prevnext.prev')}
          </span>
          <span className="sb-prevnext-title" style={{ color: token.colorText }}>
            {label(prev)}
          </span>
        </a>
      )}
      {next && (
        <a className="sb-prevnext-item sb-prevnext-next" href={href(next)} onClick={(e) => go(e, next)}>
          <span className="sb-prevnext-direction">
            {t('story.prevnext.next')} <ArrowRightOutlined />
          </span>
          <span className="sb-prevnext-title" style={{ color: token.colorText }}>
            {label(next)}
          </span>
        </a>
      )}
    </div>
  );
};

/**
 * Resolves the current story key ("introduce" from "introduce--docs") from the iframe URL. The
 * iframe URL is rewritten after mount, so poll as a fallback.
 */
export function useCurrentStoryKey(): string {
  const [key, setKey] = useState('');

  useEffect(() => {
    const read = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id') ?? '';
      setKey(id.split('--')[0] ?? '');
    };

    read();
    window.addEventListener('popstate', read);
    // storybook replaces the iframe URL via history.replaceState, which does
    // not fire popstate; poll as a cheap fallback.
    const timer = window.setInterval(read, 400);

    return () => {
      window.removeEventListener('popstate', read);
      window.clearInterval(timer);
    };
  }, []);

  return key;
}

export default PrevNextNav;
