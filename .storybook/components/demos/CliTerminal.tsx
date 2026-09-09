import { useEffect, useRef, useState } from 'react';
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
 * A macOS-style terminal window that replays CLI output line by line. Switch scenes with the tabs,
 * then press "Run" to replay the animation.
 */
export const CliTerminal = ({ scenes, title = 'Terminal' }: CliTerminalProps) => {
  const t = useStoryT();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scene = scenes[sceneIndex] ?? scenes[0];

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
  const selectScene = (index: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSceneIndex(index);
    setVisibleCount(0);
  };

  const renderLine = (line: TerminalLine, key: number) => {
    switch (line.type) {
      case 'cmd':
        return (
          <div key={key}>
            <span className="prompt">$ </span>
            <span className="cmd">{line.text}</span>
          </div>
        );
      case 'output':
        return (
          <div key={key} className="output">
            {line.text}
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
      case 'select':
        return (
          <div key={key} className="output">
            {line.text}
          </div>
        );
      case 'dim':
      default:
        return (
          <div key={key} className="dim">
            {line.text}
          </div>
        );
    }
  };

  return (
    <div>
      {scenes.length > 1 && (
        <div className="sb-tabs">
          {scenes.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`sb-tab ${i === sceneIndex ? 'active' : ''}`}
              onClick={() => selectScene(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
      <div className="sb-terminal">
        <div className="sb-terminal-header">
          <span className="sb-terminal-dot red" />
          <span className="sb-terminal-dot yellow" />
          <span className="sb-terminal-dot green" />
          <span className="sb-terminal-title">{title}</span>
          <button type="button" className="sb-copy-button" style={{ marginLeft: 'auto' }} onClick={run}>
            ▶ {t('story.demo.run')}
          </button>
        </div>
        <div className="sb-terminal-body">
          {scene.lines.slice(0, visibleCount).map((line, i) => renderLine(line, i))}
        </div>
      </div>
    </div>
  );
};

export default CliTerminal;
