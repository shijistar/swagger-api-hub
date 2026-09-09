import type { ComponentType } from 'react';
import { useStoryLocale } from '../locales';

interface LocalizedDocProps {
  docEn: ComponentType;
  docCn: ComponentType;
}

export const LocalizedDoc = ({ docEn: DocEn, docCn: DocCn }: LocalizedDocProps) => {
  const locale = useStoryLocale();
  return locale === 'en-US' ? <DocEn /> : <DocCn />;
};

export default LocalizedDoc;
