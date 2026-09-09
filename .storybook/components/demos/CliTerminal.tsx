import { useEffect, useRef, useState } from 'react';
import { Button, Tabs, type TabsProps } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { useStoryT } from '../../locales';

export interface TerminalLine {
  type: 'cmd' | 'output' | 'success' | 'warn' | 'dim' | 'select';
  text: string;
}

export interface TerminalScene {
  id: string;
  label: string;
  lines: TerminalLine[];
}

interface CliTerminalProps {
  scenes: TerminalScene[];
  title?: string;
}

/**
 * A macOS-style terminal window that replays CLI output line by line. Switch scenes with antd Tabs,
 * then press "Run" to replay the animation.
 */
export const CliTerminal = ({ scenes, title = 'Terminal' }: CliTerminalProps) => {
  const t = useStoryT();
  const [activeScene, setActiveScene] = useState(scenes[0]?.id);
  const [visibleCount, setVisibleCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scene = scenes.find((s) => s.id === activeScene) ?? scenes[0];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const run = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setVisibleCount(0);
    let count = 0;
    timerRef.current = setInterval(() => {
      count += 1;
      setVisibleCount(count);
      if (count >= scene.lines.length && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 260);
  };

  // Reset the replay when the scene changes
  const selectScene = (key: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveScene(key);
    setVisibleCount(0);
  };

  const tabs: TabsProps['items'] = scenes.map((s) => ({ key: s.id, label: s.label }));

  const renderLine = (line: TerminalLine, key: number) => {
    switch (line.type) {
      case 'cmd':
        return (
          <div key={key}>
            <span className="prompt">$ </span>
            <span className="cmd">{line.text}</span>
          </div>
        );
      case 'success':
        return (
          <div key={key} className="output success">
            {line.text}
          </div>
        );
      case 'warn':
        return (
          <div key={key} className="output warn">
            {line.text}
          </div>
        );
      case 'dim':
        return (
          <div key={key} className="dim">
            {line.text}
          </div>
        );
      case 'output':
      case 'select':
      default:
        return (
          <div key={key} className="output">
            {line.text}
          </div>
        );
    }
  };

  return (
    <div>
      <Tabs
        size="small"
        items={tabs}
        activeKey={activeScene}
        onChange={selectScene}
        tabBarStyle={{ marginBottom: 12 }}
      />
      <div className="sb-terminal">
        <div className="sb-terminal-header">
          <span className="sb-terminal-dot red" />
          <span className="sb-terminal-dot yellow" />
          <span className="sb-terminal-dot green" />
          <span className="sb-terminal-title">{title}</span>
          <Button
            size="small"
            type="primary"
            ghost
            icon={<CaretRightOutlined />}
            className="sb-terminal-run"
            onClick={run}
          >
            {t('story.demo.run')}
          </Button>
        </div>
        <div className="sb-terminal-body">
          {scene.lines.slice(0, visibleCount).map((line, i) => renderLine(line, i))}
        </div>
      </div>
    </div>
  );
};

export default CliTerminal;
