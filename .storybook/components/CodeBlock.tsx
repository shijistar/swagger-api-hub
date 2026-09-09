import { useState } from 'react';
import { App, Button } from 'antd';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { useStoryT } from '../locales';

interface CodeBlockProps {
  code: string;
  language?: string;
  maxHeight?: number;
  className?: string;
}

/**
 * A theme-aware code block with an antd copy button, built on react-syntax-highlighter (same as the
 * jsoneo docs setup).
 */
export const CodeBlock = ({ code, language = 'typescript', maxHeight = 480, className }: CodeBlockProps) => {
  const t = useStoryT();
  const { message } = App.useApp();
  const [copied, setCopied] = useState(false);
  const isDark =
    typeof document !== 'undefined' &&
    (document.documentElement.classList.contains('dark') || document.documentElement.dataset.theme === 'dark');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      message.success(t('story.demo.copied'));
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable in some sandboxed iframes
    }
  };

  return (
    <div className={`sb-code-panel ${className ?? ''}`}>
      <Button
        size="small"
        type="text"
        className="sb-code-copy"
        icon={copied ? <CheckOutlined /> : <CopyOutlined />}
        onClick={handleCopy}
      >
        {copied ? t('story.demo.copied') : t('story.demo.copy')}
      </Button>
      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        customStyle={{ margin: 0, background: 'transparent', maxHeight }}
        codeTagProps={{ style: { fontFamily: 'var(--storybook-code-font-family)', fontSize: '0.8125rem' } }}
      >
        {code.trimEnd()}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
