import { useState } from 'react';
import { CodeBlock } from '../CodeBlock';

export interface ConfigScenario {
  id: string;
  label: string;
  desc: string;
  code: string;
}

interface ConfigExamplesProps {
  scenarios: ConfigScenario[];
  fileName?: string;
}

/**
 * Tabbed ServiceConfig examples. Each tab shows a full config file with syntax highlighting and a
 * copy button.
 */
export const ConfigExamples = ({ scenarios, fileName = 'swagger-api-hub.config.ts' }: ConfigExamplesProps) => {
  const [active, setActive] = useState(0);
  const scenario = scenarios[active] ?? scenarios[0];

  return (
    <div>
      <div className="sb-tabs">
        {scenarios.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`sb-tab ${i === active ? 'active' : ''}`}
            onClick={() => setActive(i)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="sb-tab-desc">{scenario.desc}</p>
      <CodeBlock code={scenario.code} language="typescript" maxHeight={480} />
      <p className="sb-caption">{fileName}</p>
    </div>
  );
};

export default ConfigExamples;
