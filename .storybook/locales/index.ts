import { createInstance, type i18n } from 'i18next';
import { getGlobalValueFromUrl } from '../utils/global';
import enUS from './langs/en-US.json';
import zhCN from './langs/zh-CN.json';

const resources = {
  'en-US': { translation: enUS },
  'zh-CN': { translation: zhCN },
  en: { translation: enUS },
};

const globalLocale = getGlobalValueFromUrl('storyLocale');
const initialLng = globalLocale === 'zh-CN' ? 'zh-CN' : 'en-US';

export const storyI18n: i18n = createInstance({
  resources,
  lng: initialLng,
  fallbackLng: 'en-US',
  initImmediate: false,
  interpolation: { escapeValue: false },
});

export function useStoryLocale(): 'en-US' | 'zh-CN' {
  const locale = getGlobalValueFromUrl('storyLocale');
  return locale === 'zh-CN' ? 'zh-CN' : 'en-US';
}

export function useStoryT() {
  const locale = useStoryLocale();
  return (key: string, options?: Record<string, unknown>) => storyI18n.t(key, { ...options, lng: locale });
}

export function ensureStoryI18n() {
  if (!storyI18n.isInitialized && !storyI18n.isInitializing) {
    storyI18n.init();
  }
  return storyI18n;
}
